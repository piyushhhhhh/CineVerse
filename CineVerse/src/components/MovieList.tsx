import { useState } from "react";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Movie } from "@/data/movies";

interface MovieListProps {
  title: string;
  movies: Movie[];
  showViewAll?: boolean;
}

export default function MovieList({
  title,
  movies,
  showViewAll = false,
}: MovieListProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollAmount = 300;

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById(`movie-list-${title}`);
    if (!container) return;

    const newPosition =
      direction === "left"
        ? Math.max(scrollPosition - scrollAmount, 0)
        : Math.min(
            scrollPosition + scrollAmount,
            container.scrollWidth - container.clientWidth
          );

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });

    setScrollPosition(newPosition);
  };

  if (!movies.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {showViewAll && (
          <Button variant="link" className="text-gray-300 hover:text-white">
            View All
          </Button>
        )}
      </div>

      <div className="relative">
        {scrollPosition > 0 && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/80 border border-white/20"
            onClick={() => handleScroll("left")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}

        <div
          id={`movie-list-${title}`}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-[180px] md:w-[200px]"
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        <Button
          variant="secondary"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/80 border border-white/20"
          onClick={() => handleScroll("right")}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
