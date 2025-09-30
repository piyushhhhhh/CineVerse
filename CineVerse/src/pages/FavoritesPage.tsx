import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Film } from "lucide-react";
import { Movie } from "@/data/movies";
import { moviesApi } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export default function FavoritesPage() {
  const { user, isAuthenticated } = useAuth();

  const { data: favoriteMovies = [] } = useQuery({
    queryKey: ["favoriteMovies", user?.favorites],
    queryFn: async () => {
      if (!isAuthenticated || !user?.favorites || user.favorites.length === 0) {
        return [];
      }

      const moviePromises = user.favorites.map((id) =>
        moviesApi
          .getById(id)
          .then((result) =>
            result.success && result.data ? result.data : null
          )
      );

      const movies = await Promise.all(moviePromises);
      return movies.filter((movie): movie is Movie => movie !== null);
    },
    enabled: isAuthenticated && !!user && user.favorites.length > 0,
  });

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 pt-32 pb-12">
          <div className="text-center max-w-md mx-auto py-12">
            <h1 className="text-3xl font-bold mb-4">Login Required</h1>
            <p className="text-gray-400 mb-8">
              You need to be logged in to view your favorites.
            </p>
            <Link to="/login">
              <Button className="bg-cineverse-purple hover:bg-cineverse-purple/90">
                Login to continue
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-12">
        <h1 className="text-3xl font-bold mb-2">My List</h1>
        <p className="text-gray-400 mb-8">Your favorite movies in one place</p>

        {favoriteMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {favoriteMovies.map((movie) => (
              <div key={movie.id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 max-w-lg mx-auto">
            <Film className="h-16 w-16 mx-auto text-gray-700 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your list is empty</h2>
            <p className="text-gray-400 mb-6">
              Start adding movies to your favorites to see them here.
            </p>
            <Link to="/browse">
              <Button className="bg-cineverse-purple hover:bg-cineverse-purple/90">
                Browse Movies
              </Button>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
