"use client";
import { useEffect, useState } from "react";
import { register, getCurrentUser } from "../services/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { theme, resolvedTheme } = useTheme();

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        async function checkUser() {
            const user = await getCurrentUser();
            if (user) router.push("/profile");
        }
        checkUser();
    }, [router]);

    const lightLogo = "/assets/Lightlogo.png";
    const darkLogo = "/assets/Dark_logo_projc_1.png";
    const currentTheme = theme === "system" ? resolvedTheme : theme;

    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        try {
            await register(name, email, password);
            router.push("/profile");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        }
    }

    return (
      <div className="flex h-screen">
        {/* Left Section (Form) */}
        <div className="w-1/2 flex flex-col justify-center items-center bg-white dark:bg-gray-900">
          {/* ✅ Render logo only when mounted to avoid hydration errors */}
          {mounted && (
            <Image
              src={currentTheme === "dark" ? lightLogo : darkLogo}
              alt="Project Logo"
              width={300}
              height={150}
              className="mb-6"
              priority
            />
          )}

          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
            Create Account
          </h2>
          {error && (
            <p className="text-red-500 text-sm text-center mb-2">{error}</p>
          )}

          <form onSubmit={handleRegister} className="w-80 space-y-4">
            <input
              type="text"
              placeholder="Enter Name"
              className="w-full p-3 text-slate-900 border rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full p-3 text-slate-900 border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Create Password"
              className="w-full p-3 text-slate-900 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-3 rounded-md hover:bg-purple-600"
            >
              Sign up
            </button>
          </form>

          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Already a member?{" "}
            <a href="/login" className="text-purple-500 font-semibold">
              Login
            </a>
          </p>
        </div>

        {/* Right Section (Banner with Curved Shape) */}
        <div className="w-1/2 relative flex items-center justify-center bg-white dark:bg-gray-900 ">
          <div className="absolute inset-0 "></div>
          <Image
            src="/assets/register_banner.png"
            alt="Register Banner"
            width={650}
            height={600}
            className="relative z-10"
          />
        </div>

        {/* Custom Tailwind CSS for the Ellipse */}
        <style jsx>{`
          .clip-custom {
            background: rgba(162, 64, 204, 255);
            clip-path: ellipse(75% 100% at 100% 50%);
            width: 100%;
            height: 100%;
            position: absolute;
          }
        `}</style>
      </div>
    );
}
