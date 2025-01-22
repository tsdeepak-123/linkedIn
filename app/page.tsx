// app/page.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import LoginButton from "./components/LoginButton";
import LoadingSpinner from "./components/LoadingSpinner";
import SearchResult from "./components/SearchResult";

export default function Home() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchPages = async () => {
    if (!session?.accessToken || !searchQuery.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/linkedin/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setSearchResults(data.results);

      if (data.results.length === 0) {
        setError("No results found");
      }
    } catch (error) {
      console.error("Error searching pages:", error);
      setError("Failed to search LinkedIn pages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchPages()}
                  placeholder="Enter company name"
                  className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={searchPages}
                  disabled={loading || !searchQuery.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>

            {loading && <LoadingSpinner />}

            {error && (
              <div className="text-red-600 text-center mb-4">{error}</div>
            )}

            <div className="space-y-4">
              {searchResults.map((result: any) => (
                <SearchResult key={result.id} result={result} />
              ))}
            </div>
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
