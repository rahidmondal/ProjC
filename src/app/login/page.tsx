"use client";
import { useEffect, useState } from "react";
import { login, getCurrentUser } from "@/app/services/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        async function checkUser() {
            const user = await getCurrentUser();
            if (user) router.push("/profile");
        }
        checkUser();
    }, []);

    async function handleLogin(e) {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            router.push("/profile");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="flex h-screen">
            {/* Left Section (Banner) */}
            <div className="w-1/2 bg-purple-500 flex items-center justify-center">
                <Image src="/assets/login_banner.png" alt="Login Banner" width={500} height={500} />
            </div>

            {/* Right Section (Form) */}
            <div className="w-2/3 flex flex-col justify-center items-center p-8 bg-white shadow-lg rounded-lg">
                {/* Project Logo */}
                <Image src="/assets/Dark_logo_projc _1.png" alt="Project Logo" width={300} height={150} className="mb-6" />

                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Login</h2>
                {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

                <form onSubmit={handleLogin} className="w-80 space-y-4">
                    <input type="email" placeholder="Email" className="w-full p-3 border border-gray-400 rounded-md focus:ring-2 focus:ring-purple-500 outline-none shadow-md" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" className="w-full p-3 border border-gray-400 rounded-md focus:ring-2 focus:ring-purple-500 outline-none shadow-md" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="w-full bg-purple-500 text-white py-3 rounded-md hover:bg-purple-600 shadow-lg">Login</button>
                </form>

                <p className="mt-4 text-gray-600">
                    New here? <a href="/register" className="text-purple-500 font-semibold">Create an account</a>
                </p>
            </div>
        </div>
    );
}
