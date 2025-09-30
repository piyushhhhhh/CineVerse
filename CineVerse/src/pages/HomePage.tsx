import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieList from "@/components/MovieList";
import MoodSelector from "@/components/MoodSelector";
import MovieCard from "@/components/MovieCard";
import { useAuth } from "@/contexts/AuthContext";
import { moviesApi } from "@/services/api";
import { Movie } from "@/data/movies";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);

  const { data: randomMovies } = useQuery({
    queryKey: ["randomMovies", 1],
    queryFn: async () => {
      const result = await moviesApi.getAll();
      if (result.success && result.data) {
        // Get one random movie for featured section
        const randomIndex = Math.floor(Math.random() * result.data.length);
        return result.data.slice(randomIndex, randomIndex + 1);
      }
      return [];
    },
  });

  useEffect(() => {
    if (randomMovies && randomMovies.length > 0) {
      setFeaturedMovie(randomMovies[0]);
    }
  }, [randomMovies]);

  // Fetch recommended movies based on user and mood
  const { data: recommendedMovies = [] } = useQuery({
    queryKey: ["recommendedMovies", user?.id, selectedMood],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const result = await moviesApi.getRecommended(
        user?.id || "",
        selectedMood || undefined
      );
      return result.success && result.data ? result.data : [];
    },
    enabled: isAuthenticated,
  });

  // Fetch mood-based movies
  const { data: moodMovies = [] } = useQuery({
    queryKey: ["moodMovies", selectedMood],
    queryFn: async () => {
      if (!selectedMood) return [];
      const result = await moviesApi.getByMood(selectedMood);
      return result.success && result.data ? result.data : [];
    },
    enabled: !!selectedMood,
  });

  // Fetch genre movies
  const { data: actionMovies = [] } = useQuery({
    queryKey: ["genreMovies", "Action"],
    queryFn: async () => {
      const result = await moviesApi.getByGenre("Action");
      return result.success && result.data ? result.data : [];
    },
  });

  const { data: dramaMovies = [] } = useQuery({
    queryKey: ["genreMovies", "Drama"],
    queryFn: async () => {
      const result = await moviesApi.getByGenre("Drama");
      return result.success && result.data ? result.data : [];
    },
  });

  const { data: comedyMovies = [] } = useQuery({
    queryKey: ["genreMovies", "Comedy"],
    queryFn: async () => {
      const result = await moviesApi.getByGenre("Comedy");
      return result.success && result.data ? result.data : [];
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="mt-16">
          {featuredMovie && <MovieCard movie={featuredMovie} featured={true} />}
        </section>

        <div className="container mx-auto px-4 py-8">
          <MoodSelector
            onSelectMood={setSelectedMood}
            currentMood={selectedMood}
          />

          {selectedMood && moodMovies.length > 0 && (
            <MovieList
              title={`${selectedMood} Movies`}
              movies={moodMovies}
              showViewAll
            />
          )}

          {isAuthenticated && recommendedMovies.length > 0 && (
            <MovieList
              title="Recommended for You"
              movies={recommendedMovies}
              showViewAll
            />
          )}

          <MovieList title="Action Movies" movies={actionMovies} showViewAll />
          <MovieList title="Drama Movies" movies={dramaMovies} showViewAll />
          <MovieList title="Comedy Movies" movies={comedyMovies} showViewAll />
        </div>
      </main>
      <Footer />
    </div>
  );
}
