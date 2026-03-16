"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Identifiants incorrects");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock size={22} className="text-white/50" />
          </div>
          <h1 className="text-white text-2xl font-black tracking-tight">
            Connexion
          </h1>
          <p className="text-white/30 text-sm mt-2">
            Espace administration NEXTWORLD
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Identifiant"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
              autoComplete="username"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold text-sm py-3 rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
            {!loading && <ArrowRight size={14} />}
          </button>
        </form>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-white/20 text-xs hover:text-white/40 transition-colors"
          >
            Retour au globe
          </Link>
        </div>
      </div>
    </div>
  );
}
