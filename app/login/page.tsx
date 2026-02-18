"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } else {
      alert(data.error);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#062f2f] via-[#0a3f3a] to-[#021e1c] flex items-center justify-center p-8">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-10">

        <h1 className="text-3xl font-semibold text-gray-900 mb-2 text-center">
          MedChain+
        </h1>

        <p className="text-gray-500 text-center mb-8 text-sm">
          Doctor Portal Login
        </p>

        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-4 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-emerald-500
            placeholder:text-gray-500 text-gray-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-4 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-emerald-500
            placeholder:text-gray-500 text-gray-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-lg
            hover:bg-emerald-700 transition font-medium"
          >
            Login
          </button>

        </form>

      </div>

    </main>
  );
}