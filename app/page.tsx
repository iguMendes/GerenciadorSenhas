"use client";
import { FaLock } from "react-icons/fa6";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase/config";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Usuário logado:", result.user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center border">
      <button 
        onClick={handleLogin} 
        className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 hover:scale-105 transition-all duration-300"
      >
        <FaLock className="text-blue-100 text-4xl translate-x-12 transition-all duration-300" />
        Entrar com google
      </button>
    </div>
  );
}