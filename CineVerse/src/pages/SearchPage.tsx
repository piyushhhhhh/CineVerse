import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/data/movies";
import { moviesApi } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export default function SearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results
  const { data: results = [], isLoading } = useQuery({
    queryKey: ["searchMovies", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      const result = await moviesApi.getAiRecommendations(debouncedQuery);
      return result.success && result.data ? result.data : [];
    },
    enabled: !!debouncedQuery,
  });

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      setDebouncedQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = () => {
    if (searchQuery !== debouncedQuery) {
      setDebouncedQuery(searchQuery);
    }

    // Update URL without reloading page
    const newUrl = searchQuery
      ? `${window.location.pathname}?q=${encodeURIComponent(searchQuery)}`
      : window.location.pathname;
    window.history.pushState({}, "", newUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-12">
        <h1 className="text-3xl font-bold mb-8">Search Movies</h1>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by title..."
                className="pl-10 bg-cineverse-gray text-gray-200 border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button
              className="bg-cineverse-purple hover:bg-cineverse-purple/90"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        {debouncedQuery && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {results.length === 0
                ? `No results for "${debouncedQuery}"`
                : `Search results for "${debouncedQuery}"`}
            </h2>
            {results.length > 0 && (
              <p className="text-gray-400 text-sm">
                Found {results.length} result{results.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {results.map((movie) => (
            <div key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {debouncedQuery && results.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">
              No movies match your search criteria.
            </p>
            <p className="text-gray-500">
              Try a different search term or browse our categories.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
