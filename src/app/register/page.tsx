"use client";
import { useEffect, useState } from "react";
import { register, getCurrentUser } from "@/app/services/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [name, setName] = useState("");
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

    async function handleRegister(e) {
        e.preventDefault();
        setError(""); // Reset error state
        try {
            await register(name, email, password);
            router.push("/profile"); // Redirect after registration
        } catch (err) {
            setError(err.message); // Display error message
        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-[#f8f8f8]">
            <div className="w-96 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
                {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
                <form onSubmit={handleRegister} className="flex flex-col gap-3">
                    <input type="text" placeholder="Name" className="p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="email" placeholder="Email" className="p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" className="p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="bg-blue-500 text-white py-2 rounded">Register</button>
                </form>
                <p className="mt-4 text-center">
                    Already have an account? <a href="/login" className="text-blue-500">Login</a>
                </p>
            </div>
        </div>
    );
}
