import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Play } from "lucide-react";
import { Movie, moviePosters } from "@/data/movies";
import { pickRandomIndex } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  featured?: boolean;
}

export default function MovieCard({ movie, featured = false }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated, isFavorite, addToFavorites, removeFromFavorites } =
    useAuth();

  const favorited = isAuthenticated && isFavorite(movie.id);
  console.log(movie);
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (favorited) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie.id);
    }
  };

  if (featured) {
    return (
      <div className="relative w-full h-[550px] rounded-lg overflow-hidden">
        <img
          src={
            movie.poster_path ||
            moviePosters[pickRandomIndex(moviePosters.length)]
          }
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-center object-contain"
        />
        <div className="absolute inset-0 content-overlay flex flex-col justify-end p-8">
          <div className="animate-fade-in">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-cineverse-amber px-2 py-0.5 text-xs font-medium rounded">
                {movie.rating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-300">{movie.releaseYear}</span>
              <span className="text-xs text-gray-300">{movie.duration}</span>
            </div>
            <h1 className="text-4xl font-bold mb-2 text-shadow">
              {movie.title}
            </h1>
            <p className="text-gray-300 mb-6 max-w-2xl text-shadow">
              {movie.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-cineverse-gray rounded-full text-xs"
                >
                  {genre}
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <Link to={`/movie/${movie.id}`} state={{ movie }}>
                <Button className="flex items-center space-x-2 bg-cineverse-purple hover:bg-cineverse-purple/90">
                  <Play className="h-4 w-4" />
                  <span>Watch Now</span>
                </Button>
              </Link>
              {isAuthenticated && (
                <Button
                  variant={favorited ? "secondary" : "outline"}
                  onClick={handleFavoriteToggle}
                >
                  {favorited ? "Remove from List" : "Add to My List"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link to={`/movie/${movie.id}`} state={{ movie }}>
      <Card
        className="movie-card relative overflow-hidden rounded-md transition-transform duration-300 hover:scale-105 bg-transparent border-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-[2/3] relative overflow-hidden rounded-md">
          <img
            src={
              movie.poster_path ||
              moviePosters[pickRandomIndex(moviePosters.length)]
            }
            alt={movie.title}
            className="w-full h-full object-cover object-center"
          />
          <div
            className={`movie-card-overlay absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 flex flex-col justify-between p-4`}
          >
            <div>
              <h3 className="font-bold text-white">{movie.title}</h3>
              <div className="flex items-center mt-1 space-x-2">
                <span className="bg-cineverse-amber text-xs px-1.5 py-0.5 rounded">
                  {movie.rating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-300">
                  {movie.releaseYear}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {movie.genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="px-2 py-0.5 bg-cineverse-gray rounded text-xs text-gray-300"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                size="sm"
                className="w-full bg-cineverse-purple hover:bg-cineverse-purple/90 flex items-center justify-center gap-1"
              >
                <Play className="h-3 w-3" />
                <span>Play</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="py-2">
          <h3 className="font-medium truncate">{movie.title}</h3>
          <div className="flex items-center text-gray-400 text-xs">
            <span>{movie.releaseYear}</span>
            <span className="mx-2">•</span>
            <span>{movie.duration}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
