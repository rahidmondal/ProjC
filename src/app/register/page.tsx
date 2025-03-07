"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import Button from "@/components/Button";
import { register, getCurrentUser } from "@/app/services/auth";

const RegisterPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        router.push("/profile"); 
      }
    };
    checkUser();
  }, [router]);

  const handleRegister = async (email: string, password: string, name?: string) => {
    try {
      await register(email, password, name!);
      router.push("/profile");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl mb-4">Register</h1>
      <AuthForm type="register" onSubmit={handleRegister} />
      <p className="mt-4">
        Already have an account?{" "}
        <Button label="Login" onClick={() => router.push("/login")} />
      </p>
    </div>
  );
};

export default RegisterPage;
