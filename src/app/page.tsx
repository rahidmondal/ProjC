"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
            <section className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-6 py-16 pt-32">
                {/* Left Content */}
                <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
                    <h1 className="text-4xl font-bold text-purple-700 dark:text-purple-400 leading-tight">
                        Connect, Collaborate, and Code Together!
                    </h1>
                    <p className="text-gray-700 dark:text-gray-300 text-lg">
                        Proj.C is the ultimate networking platform for students learning to code. 
                        Connect with peers, collaborate on projects, and gain real-world experience in 
                        a supportive environment.
                    </p>
                    <div className="flex justify-center md:justify-start space-x-4">
                        <button
                            onClick={() => router.push("/register")}
                            className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={() => router.push("/login")}
                            className="px-6 py-3 border border-purple-500 text-purple-500 dark:border-purple-400 dark:text-purple-400 font-semibold rounded-lg hover:bg-purple-500 hover:text-white transition"
                        >
                            Login
                        </button>
                    </div>
                </div>

                {/* Right Image */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <Image
                        src="/assets/homepage_png.png"
                        alt="Collaboration Illustration"
                        width={500}
                        height={500}
                        className="rounded-lg shadow-lg"
                    />
                </div>
            </section>

            {/* Features Section */}
            <section className="w-full max-w-6xl px-6 py-16 text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">
                    Why Join Proj.C?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                        <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-400">
                            Find Your Team
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Connect with like-minded students and build real projects together.
                        </p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                        <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-400">
                            Learn & Grow
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Gain hands-on experience, improve your skills, and collaborate on coding challenges.
                        </p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                        <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-400">
                            Showcase Your Work
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                            Build a portfolio by working on projects that make a difference.
                        </p>
                    </div>
                </div>
            </section>


        </div>
    );
}
