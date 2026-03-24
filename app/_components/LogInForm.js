// app/_components/LoginForm.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../_lib/supabase";
import InputForm from "./InputForm";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginRole, setLoginRole] = useState("user");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      const userId = data?.user?.id;
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (profileError || !profile) {
        setError(
          "Could not load your role. Please try again or contact support.",
        );
        setLoading(false);
        return;
      }

      const actualRole = profile.role ?? "user";

      if (loginRole === "admin") {
        if (actualRole !== "admin") {
          setError("This account is not an admin account.");
        } else {
          window.location.replace("http://localhost:5173");
          return;
        }
      } else {
        router.push("/account");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-10 mt-10 items-center">
      <h2 className="text-3xl font-semibold">
        Sign in to access your guest area
      </h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
        <InputForm
          type="email"
          placeholder="Email address"
          value={email}
          handleChange={setEmail}
        />

        <InputForm
          type="password"
          placeholder="Password"
          value={password}
          handleChange={setPassword}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="login-role" className="text-sm text-primary-200">
            Login as
          </label>
          <select
            id="login-role"
            value={loginRole}
            onChange={(e) => setLoginRole(e.target.value)}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            disabled={loading}
          >
            <option value="user">Normal user</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-accent-500 text-primary-800 px-4 py-2 rounded-md hover:bg-accent-600 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
