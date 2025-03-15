"use client";
import { useEffect, useState } from "react";
import { login, getCurrentUser } from "../services/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";

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
            if (user) router.push("/profile");
        }
        checkUser();
    }, [router]);

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
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
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Left Section (Banner) */}
            <div className="relative w-1/2 overflow-hidden flex items-center justify-center bg-white dark:bg-gray-900 ">
                <div className="absolute inset-0  clip-custom"></div>
                <Image src="/assets/login_banner.png" alt="Login Banner" width={650} height={700} className="relative z-10" />
            </div>

            {/* Right Section (Form) */}
            <div className="w-1/2 flex flex-col justify-center items-center bg-white dark:bg-gray-900 p-8 shadow-lg">
                {mounted && (
                    <Image
                        src={theme === "dark" ? "/assets/Lightlogo.png" : "/assets/Dark_logo_projc_1.png"}
                        alt="Project Logo"
                        width={300}
                        height={150}
                        className="mb-6"
                    />
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

            <style jsx>{`
                .clip-custom {
                    clip-path: ellipse(77% 100% at 7% 45%);
                }
            `}</style>
        </div>
    );
}
