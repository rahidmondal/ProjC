"use client";
import { useEffect, useState } from "react";
import { login, getCurrentUser } from "../services/auth"; 
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes"; 
import Link from "next/link";
import { useUser } from "../contexts/UserContext"; 

export default function LoginPage() {
    const { theme } = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false); 
    const router = useRouter();

    const { refetchUser } = useUser();

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        async function checkUser() {
            const user = await getCurrentUser();
            if (user) {
                console.log("User already logged in, redirecting from login page...");
                router.push("/user-profile");
            }
        }
        checkUser();
    }, [router]);

    useEffect(() => {
        document.body.classList.add("hide-nav-footer");
        return () => {
            document.body.classList.remove("hide-nav-footer");
        };
    }, []);

    const currentLogo = mounted ? ( (theme === 'dark') ? "/assets/lightLogo.png" : "/assets/darkLogo.png" ) : "/assets/darkLogo.png";

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isLoggingIn) return; 

        setError("");
        setIsLoggingIn(true); 

        try {
            const loggedInUser = await login(email, password);

            if (loggedInUser) {
                 console.log("Login successful, refetching user context data...");
                 await refetchUser();
                 console.log("User context refetched.");

                 router.push("/user-profile");
            } else {
                 setError("Login seemed successful, but failed to retrieve user data.");
            }
        } catch (err: unknown) { 
            const message = err instanceof Error ? err.message : "An unexpected error occurred.";

            if (err instanceof Error && 'code' in err && typeof err.code === 'number' && err.code === 401) {
                setError("Invalid email or password.");
            } else if (message.includes("Invalid credentials")) {
                setError("Invalid email or password.");
            }
             else {
                setError(`Login failed: ${message}`);
            }
            console.error("Login Page Error:", err);
        } finally {
            setIsLoggingIn(false); 
        }
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Left Section (Banner) -*/}
            <div className="hidden md:block relative w-1/2 h-full">
                {/* Background Fill */}
                <div className="absolute inset-0 bg-white dark:bg-gray-900"></div>
                {/* Image */}
                <Image
                    src="/assets/login_banner.png" 
                    alt="Login Banner"
                    fill
                    sizes="50vw"
                    style={{ objectFit: "cover" }}
                    className="relative z-10"
                    priority
                />
            </div>

            {/* Right Section (Form) */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white dark:bg-gray-900 p-8 shadow-lg overflow-y-auto">
                 {/* Logo */}
                 <Link href="/">
                    <Image
                        src={currentLogo}
                        alt="Project Logo"
                        width={250} 
                        height={125}
                        className="mb-6 h-auto" 
                        priority
                    />
                </Link>

                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">Login to Your Account</h2>
                {error && <p className="text-red-500 text-sm text-center mb-2 max-w-xs">{error}</p>}

                 {/* Form */}
                 <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        className="w-full p-3 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none shadow-sm bg-white dark:bg-gray-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        className="w-full p-3 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none shadow-sm bg-white dark:bg-gray-700"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                     {/* Submit Button */}
                     <button
                        type="submit"
                        className={`w-full py-3 rounded-md text-white font-semibold transition-colors duration-200 ${
                            isLoggingIn
                                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                                : "bg-purple-500 hover:bg-purple-600 shadow-lg"
                        }`}
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Registration Link */}
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                    New here?{" "}
                    <Link href="/register" legacyBehavior><a className="text-purple-500 font-semibold hover:underline">Create an account</a></Link>
                </p>
            </div>
        </div>
    );
}