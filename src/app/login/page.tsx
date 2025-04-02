"use client";
import { useEffect, useState } from "react";
import { login, getCurrentUser } from "../services/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function LoginPage() {
    const { theme } = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    // Ensure client-side rendering before using the theme
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        async function checkUser() {
            const user = await getCurrentUser();
            if (user) router.push("/user-profile");
        }
        checkUser();
    }, [router]);

    // ✅ Hide Navbar/Footer on Login Page
    useEffect(() => {
        document.body.classList.add("hide-nav-footer");
        return () => {
            document.body.classList.remove("hide-nav-footer");
        };
    }, []);
    
    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            router.push("/user-profile");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        }
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Left Section (Banner) */}
            <div className="relative w-1/2 h-full flex items-center justify-center">
                {/* Background Fill */}
                <div className="absolute inset-0 bg-white dark:bg-gray-900"></div>

                {/* Image (Ensures Full Coverage) */}
                <Image 
                    src="/assets/login_banner.png" 
                    alt="Login Banner" 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                    style={{ objectFit: "cover" }} 
                    className="relative z-10"
                />
            </div>

            {/* Right Section (Form) */}
            <div className="w-1/2 flex flex-col justify-center items-center bg-white dark:bg-gray-900 p-8 shadow-lg">
                {mounted && (
                    <Link href="/">
                        <Image
                            src={theme === "dark" ? "/assets/Lightlogo.png" : "/assets/Dark_logo_projc_1.png"}
                            alt="Project Logo"
                            width={300}
                            height={150}
                            className="mb-6"
                        />
                    </Link>
                )}

                <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Login</h2>
                {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

                <form onSubmit={handleLogin} className="w-80 space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 text-gray-900 dark:text-gray-200 border border-gray-400 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 outline-none shadow-md bg-white dark:bg-gray-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 text-gray-900 dark:text-gray-200 border border-gray-400 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 outline-none shadow-md bg-white dark:bg-gray-700"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="w-full bg-purple-500 text-white py-3 rounded-md hover:bg-purple-600 shadow-lg">
                        Login
                    </button>
                </form>

                <p className="mt-4 text-gray-600 dark:text-gray-300">
                    New here? <a href="/register" className="text-purple-500 font-semibold">Create an account</a>
                </p>
            </div>
        </div>
    );
}
