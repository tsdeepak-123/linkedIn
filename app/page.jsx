// app/page.jsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import LoginButton from "./components/LoginButton";
import LoadingSpinner from "./components/LoadingSpinner";
import LinkedInPosts from "./components/LinkedInPosts";

export default function Home() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            LinkedIn Page Search
          </h1>
          <LoginButton />
        </div>

        {session ? (
          <>
            <LinkedInPosts accessToken={session.accessToken} />
            {loading && <LoadingSpinner />}
            {error && (
              <div className="text-red-600 text-center mb-4">{error}</div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to LinkedIn Page Search
            </h2>
            <p className="text-gray-600 mb-4">
              Sign in with LinkedIn to search pages and view company information
            </p>
          </div>
        )}
      </div>
    </main>
  );
}