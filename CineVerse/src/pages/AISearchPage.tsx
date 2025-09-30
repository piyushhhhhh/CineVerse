import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/data/movies";
import { moviesApi } from "@/services/api";

export default function AISearchPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const res = await moviesApi.aiSearch(input);
      if (res.success && res.data) {
        setResults(res.data);
      } else {
        setError("No results found.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-32">
        <h1 className="text-3xl font-bold mb-6">AI Movie Search</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <input
            type="text"
            className="border border-gray-400 text-black rounded px-4 py-2 flex-1"
            // className="w-64 bg-cineverse-gray text-gray-200 pl-10 rounded-full focus:ring-cineverse-purple focus:border-cineverse-purple border-gray-700"
            placeholder="Describe what you want to watch..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-cineverse-purple text-white px-6 py-2 rounded hover:bg-cineverse-darker"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {results.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-[180px] md:w-[200px]"
            >
              <MovieCard key={movie.id} movie={movie} />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
