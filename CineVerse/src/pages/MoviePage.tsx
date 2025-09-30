import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/VideoPlayer";
import {
  ChevronLeft,
  Clock,
  Star,
  Heart,
  Sparkles,
  CalendarIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { moviesApi } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { moviePosters, videoClipUrl } from "@/data/movies";
import { pickRandomIndex } from "@/lib/utils";

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const passedMovie = location.state?.movie;
  const navigate = useNavigate();
  const { isAuthenticated, isFavorite, addToFavorites, removeFromFavorites } =
    useAuth();
  const [playing, setPlaying] = useState(false);
  const [movie, setMovie] = useState(passedMovie || null);

  const {
    data: fetchedMovie,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      if (!id) throw new Error("Movie ID is required");
      const result = await moviesApi.getById(id);
      if (!result.success || !result.data) {
        throw new Error(result.error || "Movie not found");
      }
      return result.data;
    },
    enabled: !passedMovie, // Only fetch if not passed
  });

  useEffect(() => {
    // Reset playing state when movie changes
    setPlaying(false);
    if (passedMovie) setMovie(passedMovie);
    else if (fetchedMovie) setMovie(fetchedMovie);
  }, [id, passedMovie, fetchedMovie]);

  const isFav = movie && isAuthenticated ? isFavorite(movie.id) : false;

  const toggleFavorite = () => {
    if (!movie) return;

    if (isFav) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 pt-20">
          <div className="container mx-auto px-4 pt-12 pb-12">
            <div className="animate-pulse">
              <div className="h-96 bg-cineverse-gray rounded-lg mb-6"></div>
              <div className="h-8 bg-cineverse-gray rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-cineverse-gray rounded w-1/4 mb-8"></div>
              <div className="h-24 bg-cineverse-gray rounded mb-6"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container mx-auto px-4 pt-32 pb-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Movie not found</h1>
          <p className="text-gray-400 mb-8">
            The movie you're looking for doesn't exist or has been removed.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="relative">
          {playing ? (
            <div className="aspect-video w-full max-h-[80vh] bg-black">
              <VideoPlayer
                videoUrl={videoClipUrl}
                title={movie.title}
                autoPlay
              />
            </div>
          ) : (
            <div className="relative aspect-video w-full max-h-[80vh] overflow-hidden">
              <img
                src={
                  movie.poster_path ||
                  moviePosters[pickRandomIndex(moviePosters.length)]
                }
                alt={movie.title}
                className="w-full h-full object-center object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cineverse-dark to-transparent"></div>
              <Button
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cineverse-purple/80 hover:bg-cineverse-purple text-white px-6 py-6 rounded-full"
                onClick={() => setPlaying(true)}
              >
                <span className="sr-only">Play</span>
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                </svg>
              </Button>
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 py-8">
          <Link
            to="/browse"
            className="inline-flex items-center text-gray-400 hover:text-white mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Browse
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="md:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center text-sm text-gray-400 mb-6 gap-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{movie.releaseYear}</span>
                </div>

                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{movie.duration}</span>
                </div>

                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>{movie.rating} / 5</span>
                </div>
              </div>

              <p className="text-lg mb-8">{movie.description}</p>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Link
                      key={genre}
                      to={`/browse?genre=${genre}`}
                      className="bg-cineverse-gray px-3 py-1 rounded-full text-sm hover:bg-cineverse-gray/80"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Moods</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.moods.map((mood) => (
                    <div
                      key={mood}
                      className="bg-cineverse-purple/20 border border-cineverse-purple/30 px-3 py-1 rounded-full text-sm"
                    >
                      <span className="mr-1">
                        {mood === "Happy"
                          ? "😊"
                          : mood === "Relaxed"
                          ? "😌"
                          : mood === "Excited"
                          ? "🎢"
                          : mood === "Thoughtful"
                          ? "🤔"
                          : mood === "Melancholic"
                          ? "😢"
                          : mood === "Tense"
                          ? "😰"
                          : mood === "Inspired"
                          ? "✨"
                          : mood === "Nostalgic"
                          ? "🕰️"
                          : ""}
                      </span>
                      {mood}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:w-1/3 flex flex-col gap-4">
              <Button
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setPlaying(true)}
              >
                <span>Watch Movie Clip</span>
              </Button>

              {isAuthenticated && (
                <Button
                  variant={isFav ? "destructive" : "outline"}
                  className={`w-full flex items-center justify-center gap-2 ${
                    isFav ? "" : "hover:bg-pink-600 hover:text-white"
                  }`}
                  onClick={toggleFavorite}
                >
                  {isFav ? (
                    <>
                      <Heart className="h-5 w-5 fill-current" />
                      <span>Remove from Favorites</span>
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5" />
                      <span>Add to Favorites</span>
                    </>
                  )}
                </Button>
              )}

              <div className="mt-4 p-4 bg-cineverse-gray rounded-lg">
                <div className="flex items-center gap-2 text-cineverse-purple mb-2">
                  <Sparkles className="h-5 w-5" />
                  <h3 className="font-semibold">Why we recommend it</h3>
                </div>
                <p className="text-sm text-gray-300">
                  This {movie.genres.join(", ")} movie perfectly captures the{" "}
                  {movie.moods.join(" and ")} mood you're looking for, with
                  stunning visuals and an engaging storyline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
