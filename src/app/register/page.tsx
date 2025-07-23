"use client";
import { useEffect, useState } from "react";
import { register, getCurrentUser } from "../services/auth"; 
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useUser } from "../contexts/UserContext"; 

export default function RegisterPage() {
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); 
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { refetchUser } = useUser();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    async function checkUser() {
      const user = await getCurrentUser();
      if (user) {
          // console.log("User already logged in, redirecting from register page...");
          router.push("/user-profile");
      }
    }
    checkUser();
  }, [router]);


  const currentLogo = mounted ? ( (resolvedTheme === 'dark') ? "/assets/lightLogo.png" : "/assets/darkLogo.png" ) : "/assets/darkLogo.png";

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed || isRegistering) return; 
    setError("");
    setIsRegistering(true); 

    try {
      const loggedInUser = await register(name, email, password);

      if (loggedInUser) {
          // console.log("Registration successful, refetching user context data...");
          await refetchUser();
          // console.log("User context refetched.");

          router.push("/user-profile?edit=true"); 
      } else {
           setError("Registration seemed successful, but failed to log in.");
      }

    } catch (err: unknown) { 
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";

      if (err instanceof Error && 'code' in err && typeof err.code === 'number' && err.code === 409) {
          setError("An account with this email already exists. Please login.");
      } else if (message.includes("user_already_exists")) {
          setError("An account with this email already exists. Please login.");
      } else {
          setError(`Registration failed: ${message}`);
      }
      console.error("Registration Page Error:", err);
    } finally {
        setIsRegistering(false); 
    }
  }

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

        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Create an account</h1>
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
          src="/assets/register_banner.png" 
          alt="Register Banner"
          fill
          sizes="50vw"
          style={{ objectFit: "cover" }}
          priority 
        />
      </div>
    </div>
  );
}