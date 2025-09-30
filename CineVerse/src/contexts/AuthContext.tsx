import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { authApi, User } from "@/services/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addToFavorites: (movieId: string) => void;
  removeFromFavorites: (movieId: string) => void;
  isFavorite: (movieId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("cineverse_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const result = await authApi.login({ email, password });

      if (result.success && result.data) {
        setUser(result.data);
        localStorage.setItem("cineverse_user", JSON.stringify(result.data));
        toast.success(`Welcome back, ${result.data.name}!`);
        return true;
      } else {
        toast.error(result.error || "Invalid email or password");
        return false;
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const result = await authApi.signup({ name, email, password });

      if (result.success && result.data) {
        setUser(result.data);
        localStorage.setItem("cineverse_user", JSON.stringify(result.data));
        toast.success(`Welcome to CineVerse, ${name}!`);
        return true;
      } else {
        toast.error(result.error || "Registration failed");
        return false;
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cineverse_user");
    toast.info("You have been logged out");
  };

  const addToFavorites = (movieId: string) => {
    if (!user) return;

    const updatedFavorites = [...user.favorites, movieId];
    updateFavorites(updatedFavorites, "Added to favorites");
  };

  const removeFromFavorites = (movieId: string) => {
    if (!user) return;

    const updatedFavorites = user.favorites.filter((id) => id !== movieId);
    updateFavorites(updatedFavorites, "Removed from favorites");
  };

  const updateFavorites = async (
    favorites: string[],
    successMessage: string
  ) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, favorites };
      setUser(updatedUser);
      localStorage.setItem("cineverse_user", JSON.stringify(updatedUser));
      toast.success(successMessage);

      const result = await authApi.updateFavorites(user.id, favorites);

      if (!result.success) {
        const storedUser = localStorage.getItem("cineverse_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        toast.error("Failed to update favorites");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites");
    }
  };

  const isFavorite = (movieId: string): boolean => {
    return user ? user.favorites.includes(movieId) : false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
