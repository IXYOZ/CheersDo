"use client";
import React, { useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signOut({redirect:false})
    const res = await signIn("email", { email, redirect: false });

    if (res?.ok) {
      alert("Please check your email for login link!");
    } else {
      alert("Failed to send login link.");
    }
  };
  if (status === "loading") return null;
  if (status === "authenticated") return null;
  return (
    <main className="flex flex-col items-center gap-4 mt-10">
      <h1 className="text-2xl font-bold">Login</h1>
      <form
        onSubmit={handleLogin}
        method="post"
        className="flex flex-col gap-2"
      >
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="border p-2 rounded w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Send Login Link
        </button>
      </form>
    </main>
  );
}
