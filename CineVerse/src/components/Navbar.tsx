import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Film, LogIn, Search, User } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-cineverse-darker shadow-md"
          : "bg-gradient-to-b from-cineverse-darker to-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Film className="h-8 w-8 text-cineverse-purple" />
              <span className="font-bold text-xl">CineVerse</span>
            </Link>

            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-sm text-gray-300 hover:text-white">
                Home
              </Link>
              <Link
                to="/browse"
                className="text-sm text-gray-300 hover:text-white"
              >
                Browse
              </Link>
              <Link
                to="/ai-search"
                className="text-sm text-gray-300 hover:text-white"
              >
                AI Search
              </Link>
              {isAuthenticated && (
                <Link
                  to="/favorites"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  My List
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Search movies..."
                className="w-64 bg-cineverse-gray text-gray-200 pl-10 rounded-full focus:ring-cineverse-purple focus:border-cineverse-purple border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </form>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile">
                  <Button
                    variant="ghost"
                    className="rounded-full p-2"
                    size="icon"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
