import { Film } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-cineverse-darker mt-auto pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center space-x-2">
              <Film className="h-6 w-6 text-cineverse-purple" />
              <span className="font-bold text-lg">CineVerse</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm max-w-xs">
              Discover movies based on your mood, preferences, and what your
              friends are watching.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-gray-300 font-medium mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Browse
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Search
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-300 font-medium mb-4">Account</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/login"
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    My Profile
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6">
          <p className="text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} CineVerse Mood Matcher. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
