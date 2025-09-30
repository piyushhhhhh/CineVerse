import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MovieCard from "@/components/MovieCard";
import { genres, moods, Movie } from "@/data/movies";
import { moviesApi } from "@/services/api";

export default function BrowsePage() {
  const [activeTab, setActiveTab] = useState<"genres" | "moods">("genres");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  const getMovies = useCallback(async () => {
    const moviePromise =
      activeTab === "genres" && selectedGenre
        ? moviesApi.getByGenre(selectedGenre)
        : activeTab === "moods" && selectedMood
        ? moviesApi.getByMood(selectedMood)
        : moviesApi.getAll();

    const { data } = await moviePromise;
    setFilteredMovies(data);
  }, [activeTab, selectedGenre, selectedMood]);

  useEffect(() => {
    getMovies();
  }, [getMovies]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-12">
        <h1 className="text-3xl font-bold mb-8">Browse Movies</h1>

        <Tabs
          defaultValue="genres"
          onValueChange={(value) => setActiveTab(value as "genres" | "moods")}
        >
          <TabsList className="w-full max-w-md mb-6">
            <TabsTrigger value="genres" className="flex-1">
              By Genre
            </TabsTrigger>
            <TabsTrigger value="moods" className="flex-1">
              By Mood
            </TabsTrigger>
          </TabsList>

          <TabsContent value="genres" className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  className={`px-4 py-2 rounded-full text-sm ${
                    selectedGenre === genre
                      ? "bg-cineverse-purple text-white"
                      : "bg-cineverse-gray text-gray-300 hover:bg-cineverse-gray/80"
                  }`}
                  onClick={() =>
                    setSelectedGenre(selectedGenre === genre ? null : genre)
                  }
                >
                  {genre}
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="moods" className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <button
                  key={mood}
                  className={`px-4 py-2 rounded-full text-sm ${
                    selectedMood === mood
                      ? "bg-cineverse-purple text-white"
                      : "bg-cineverse-gray text-gray-300 hover:bg-cineverse-gray/80"
                  }`}
                  onClick={() =>
                    setSelectedMood(selectedMood === mood ? null : mood)
                  }
                >
                  {mood}
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-6">
            {activeTab === "genres" && selectedGenre
              ? `${selectedGenre} Movies`
              : activeTab === "moods" && selectedMood
              ? `${selectedMood} Movies`
              : "All Movies"}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredMovies.map((movie) => (
              <div key={movie.id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

          {filteredMovies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">
                No movies found for your selection.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
