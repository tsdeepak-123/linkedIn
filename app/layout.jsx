// app/layout.jsx
import { NextAuthProvider } from './providers';
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}