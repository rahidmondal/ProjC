"use client";

import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (email: string, password: string, name?: string) => Promise<void>;
  error?: string; // Parent error message from API
}

const AuthForm = ({ type, onSubmit, error }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ✅ Validate email format
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    setFormError(null); // Clear previous form errors
    const trimmedEmail = email.trim().toLowerCase(); // Normalize email
    const trimmedName = name.trim();
    
    // ✅ Client-side validation
    if (!isValidEmail(trimmedEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }
    if (type === "register" && !trimmedName) {
      setFormError("Name is required.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(trimmedEmail, password, trimmedName);
    } catch (err: any) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-md shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center mb-4">
        {type === "login" ? "Login to Your Account" : "Create an Account"}
      </h2>

      {/* 🔴 Display form validation errors OR API errors */}
      {formError && <p className="text-red-500 text-center mb-2">{formError}</p>}
      {error && !formError && <p className="text-red-500 text-center mb-2">{error}</p>}

      {type === "register" && (
        <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
      )}
      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <Button 
        label={loading ? "Processing..." : type === "login" ? "Login" : "Sign Up"} 
        onClick={handleSubmit} 
        disabled={loading} 
      />
    </div>
  );
};

export default AuthForm;
