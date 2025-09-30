import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 pt-32 pb-12">
          <div className="text-center max-w-md mx-auto py-12">
            <h1 className="text-3xl font-bold mb-4">Login Required</h1>
            <p className="text-gray-400 mb-8">
              You need to be logged in to view your profile.
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
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>

          <div className="bg-cineverse-gray rounded-lg p-6">
            <Tabs defaultValue="profile">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    contentEditable={false}
                    value={user.name}
                    className="bg-cineverse-dark border-gray-700"
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    contentEditable={false}
                    value={user.email}
                    className="bg-cineverse-dark border-gray-700"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
