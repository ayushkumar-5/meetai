"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const { data: session } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSignUp = () => {
    setLoading(true);
    setError("");
    setSuccess("");
    if (!name) {
      setError("Name is required for sign up.");
      setLoading(false);
      return;
    }
    authClient.signUp.email(
      { email, name, password },
      {
        onError: (err) => {
          setError("Error signing up");
          setSuccess("");
          setLoading(false);
        },
        onSuccess: () => {
          setSuccess("Sign up successful! Please check your email or log in.");
          setError("");
          setLoading(false);
        },
      }
    );
  };

  const onLogin = () => {
    setLoading(true);
    setError("");
    setSuccess("");
    authClient.signIn.email(
      { email, password },
      {
        onError: (err) => {
          setError("Login failed. Please check your credentials.");
          setSuccess("");
          setLoading(false);
        },
        onSuccess: () => {
          setSuccess("Login successful!");
          setError("");
          setLoading(false);
        },
      }
    );
  };

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md flex flex-col items-center gap-4">
          <p className="text-lg font-semibold">Logged in as <span className="text-primary">{session.user.name}</span></p>
          <Button variant="outline" onClick={() => authClient.signOut()}>
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center mb-2">Welcome to MeetAI</h2>
        <p className="text-center text-gray-500 mb-4">Sign up or log in to continue</p>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium">Name <span className="text-gray-400">(Sign Up only)</span></label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name (Sign Up only)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              disabled={loading}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center">{success}</div>}
        <div className="flex gap-4 mt-2">
          <Button className="w-1/2" onClick={onSignUp} disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
          <Button className="w-1/2" variant="outline" onClick={onLogin} disabled={loading}>
            {loading ? "Logging In..." : "Log In"}
          </Button>
        </div>
      </div>
    </div>
  );
}
