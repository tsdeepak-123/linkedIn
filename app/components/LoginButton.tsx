'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Linkedin, LogOut, User } from 'lucide-react';

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-6 p-3 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user?.name || 'User'}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">
              {session.user?.name}
            </span>
            <span className="text-xs text-gray-500">
              {session.user?.email}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('linkedin')}
      className="group relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 overflow-hidden"
    >
      <div className="relative z-10 flex items-center gap-3">
        <Linkedin className="w-5 h-5" />
        <span className="font-semibold">Sign in with LinkedIn</span>
      </div>
      <div className="absolute inset-0 w-full h-full bg-white/10 transform -skew-x-12 transition-transform duration-500 ease-out translate-x-full group-hover:translate-x-0" />
    </button>
  );
}