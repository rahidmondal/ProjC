"use client";
import { useEffect, useState } from "react";
import { register, getCurrentUser } from "@/app/services/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
    const [name, setName] = useState("");
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

    async function handleRegister(e) {
        e.preventDefault();
        setError("");
        try {
            await register(name, email, password);
            router.push("/profile");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="flex h-screen">
            {/* Left Section (Form) */}

            <div className="w-1/2 flex flex-col justify-center items-center bg-white p-8">
                {/* Project Logo */}
                <Image src="/assets/Dark_logo_projc _1.png" alt="Project Logo" width={300} height={150} className="mb-6" />

                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Create Account</h2>
                {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

                <form onSubmit={handleRegister} className="w-80 space-y-4">
                    <input type="text" placeholder="Enter Name" className="w-full p-3 border rounded-md" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="email" placeholder="Enter Email" className="w-full p-3 border rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Create Password" className="w-full p-3 border rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="w-full bg-purple-500 text-white py-3 rounded-md hover:bg-purple-600">Sign up</button>
                </form>

                <p className="mt-4 text-gray-600">
                    Already a member? <a href="/login" className="text-purple-500 font-semibold">Login</a>
                </p>
            </div>

            {/* Right Section (Banner) */}
            <div className="w-1/2 bg-purple-500 flex items-center justify-center">
                <Image src="/assets/register_banner.png" alt="Register Banner" width={500} height={500} />
            </div>
        </div>
    );
}
