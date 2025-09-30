import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Film } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cineverse-darker p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center">
            <Film className="h-10 w-10 text-cineverse-purple" />
            <span className="ml-2 text-2xl font-bold">CineVerse</span>
          </Link>
          <h1 className="mt-6 text-3xl font-bold">Sign in to your account</h1>
          <p className="mt-2 text-gray-400">
            Enter your credentials to access your account
          </p>
        </div>

        <div className="bg-cineverse-gray p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-cineverse-dark border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-cineverse-purple hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-cineverse-dark border-gray-700"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-cineverse-purple hover:bg-cineverse-purple/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-400">Don't have an account? </span>
              <Link
                to="/signup"
                className="text-cineverse-purple hover:underline"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Demo credentials: user@example.com / password123</p>
        </div>
      </div>
    </div>
  );
}
