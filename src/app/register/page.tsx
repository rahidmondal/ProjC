"use client";
import { useEffect, useState } from "react";
import { register, getCurrentUser } from "../services/auth"; // Keep auth service import
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes"; // Assuming you use next-themes
import Link from "next/link";
import { useUser } from "../contexts/UserContext"; // *** 1. Import useUser ***

export default function RegisterPage() {
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Add loading state
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // *** 2. Get refetchUser from context ***
  const { refetchUser } = useUser();

  useEffect(() => setMounted(true), []);

  // Effect to redirect if already logged in
  useEffect(() => {
    async function checkUser() {
      // Consider using useUser here too for consistency, but keep separate for now
      // if you want this page accessible even if context is loading slowly initially
      const user = await getCurrentUser();
      if (user) {
          console.log("User already logged in, redirecting from register page...");
          router.push("/user-profile"); // Redirect logged-in users away
      }
    }
    checkUser();
  }, [router]);


  const lightLogo = "/assets/Lightlogo.png";
  const darkLogo = "/assets/Dark_logo_projc_1.png"; // Make sure this path is correct
  // Determine current theme safely after mount
  const currentLogo = mounted ? ( (theme === 'dark' || resolvedTheme === 'dark') ? lightLogo : darkLogo ) : darkLogo; // Default or based on theme


  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed || isRegistering) return; // Prevent submit if not agreed or already registering

    setError("");
    setIsRegistering(true); // Set loading state

    try {
      // Call the register service (which creates auth user AND db document)
      const loggedInUser = await register(name, email, password);

      if (loggedInUser) {
          // *** 3. Refetch context data AFTER successful registration/login ***
          console.log("Registration successful, refetching user context data...");
          await refetchUser();
          console.log("User context refetched.");

          // *** 4. Redirect AFTER refetch is complete ***
          router.push("/user-profile?edit=true"); // Redirect to profile, maybe prompt edit
      } else {
          // This case might occur if register->login internally fails silently
           setError("Registration seemed successful, but failed to log in.");
      }

    } catch (err: unknown) { // Type the error
        const message = err instanceof Error ? err.message : "An unexpected error occurred.";
        // Provide more specific feedback if possible (e.g., check for 409 Conflict)
        if (message.includes("user_already_exists") || (err as any)?.code === 409) {
             setError("An account with this email already exists. Please login.");
        } else {
            setError(`Registration failed: ${message}`);
        }
        console.error("Registration Page Error:", err);
    } finally {
        setIsRegistering(false); // Reset loading state
    }
  }

  // Effect to hide nav/footer (keep as is)
  useEffect(() => {
    document.body.classList.add("hide-nav-footer");
    return () => {
      document.body.classList.remove("hide-nav-footer");
    };
  }, []);


  return (
    <div className="flex h-screen">
      {/* Left Section (Form) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white dark:bg-gray-900 p-6 overflow-y-auto">
        {/* Render logo safely */}
        <Link href="/">
            <Image
              // Use derived logo source safely after mount
              src={currentLogo}
              alt="Project Logo"
              width={250} // Adjusted size
              height={125}
              className="mb-6 cursor-pointer h-auto" // Ensure height adjusts
              priority
            />
        </Link>

        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
          Create Your Account
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-2 max-w-xs">{error}</p>
        )}

        <form onSubmit={handleRegister} className="w-full max-w-xs space-y-4">
          {/* Inputs remain the same */}
           <input type="text" placeholder="Enter Name" className="w-full p-3 text-slate-900 border dark:border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white" value={name} onChange={(e) => setName(e.target.value)} required />
           <input type="email" placeholder="Enter Email" className="w-full p-3 text-slate-900 border dark:border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white" value={email} onChange={(e) => setEmail(e.target.value)} required />
           <input type="password" placeholder="Create Password" className="w-full p-3 text-slate-900 border dark:border-gray-600 rounded-md focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}/> {/* Add minLength */}

          {/* Terms Agreement */}
          <div className="flex items-start space-x-2 pt-2">
            <input type="checkbox" id="terms" className="w-4 h-4 mt-1 accent-purple-500 cursor-pointer flex-shrink-0" checked={agreed} onChange={() => setAgreed(!agreed)} />
            <label htmlFor="terms" className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">I agree to the <a href="/terms-of-service" className="text-purple-500 font-semibold hover:underline" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy-policy" className="text-purple-500 font-semibold hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a></label>
          </div>

           {/* Submit Button */}
           <button
            type="submit"
            className={`w-full py-3 rounded-md text-white font-semibold transition-colors duration-200 ${
              agreed && !isRegistering
                ? "bg-purple-500 hover:bg-purple-600"
                : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
            }`}
            disabled={!agreed || isRegistering}
          >
            {isRegistering ? "Signing up..." : "Sign up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          Already a member?{" "}
          <Link href="/login" legacyBehavior><a className="text-purple-500 font-semibold hover:underline">Login</a></Link>
        </p>
      </div>

      {/* Right Section (Banner) */}
      <div className="hidden md:block w-1/2 relative bg-white dark:bg-gray-900">
        <Image
          src="/assets/register_banner.png" // Ensure this path is correct
          alt="Register Banner"
          fill
          sizes="50vw"
          style={{ objectFit: "cover" }}
          priority // Load banner image early
        />
      </div>
    </div>
  );
}