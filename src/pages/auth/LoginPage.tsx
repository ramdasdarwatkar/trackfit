import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { Input } from "../../components/ui/Input";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // Success is handled automatically by AuthContext listener
  };

  return (
    <div className="flex flex-col h-full justify-center px-8 bg-black">
      <div className="mb-10 text-center">
        {/* Requirement 2.1: Logo Placeholder */}
        <div className="w-20 h-20 bg-brand rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-brand/20">
          <span className="text-3xl font-bold">TF</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-slate-400 text-sm">Sign in to track your progress</p>
      </div>

      <form onSubmit={handleSignIn} className="space-y-2">
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          placeholder="name@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {error && <p className="text-red-500 text-xs ml-1">{error}</p>}

        <button
          disabled={loading}
          className="w-full h-14 bg-brand text-white font-semibold rounded-2xl mt-6 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? "Authenticating..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};
