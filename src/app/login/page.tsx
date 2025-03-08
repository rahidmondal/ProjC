"use client";
import { useEffect, useState } from "react";
import { login, getCurrentUser } from "@/app/services/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        async function checkUser() {
            const user = await getCurrentUser();
            if (user) router.push("/profile"); // Redirect if already logged in
        }
        checkUser();
    }, []);

    async function handleLogin(e) {
        e.preventDefault();
        setError(""); // Reset error state
        try {
            await login(email, password);
            router.push("/profile"); // Redirect after login
        } catch (err) {
            setError(err.message); // Display error message
        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-[#f8f8f8]">
            <div className="w-96 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
                <form onSubmit={handleLogin} className="flex flex-col gap-3">
                    <input type="email" placeholder="Email" className="p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" className="p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="bg-blue-500 text-white py-2 rounded">Login</button>
                </form>
                <p className="mt-4 text-center">
                    Don't have an account? <a href="/register" className="text-blue-500">Register</a>
                </p>
            </div>
        </div>
    );
}
