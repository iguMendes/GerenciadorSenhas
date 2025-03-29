"use client";
import { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import FormFields from "../components/formFields";  // Certifique-se de que o caminho está correto

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/"); 
      }
    });

    return () => unsubscribe(); 
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/"); 
  };

  return (
    <div className="min-h-screen flex flex-col items-end justify-start space-y-4 pt-1 pr-2">
      {user ? (
        <>
          <img 
            src={user.photoURL || "/default-avatar.png"} 
            alt="Foto de perfil" 
            className="w-8 h-8 rounded-full border"
          />
          <h2 className="text-sm font-semibold">{user.displayName}</h2>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-500 text-sm text-white rounded-md hover:bg-red-600 transition"
          >
            LogOut
          </button>          
        </>
      ) : (
        <p>Carregando usuário...</p>
      )}
  
      {/* Isolando o FormFields com um contêiner customizado */}
      <div className="flex-col items-center justify-center w-full px-4 py-6">
        <FormFields />
      </div>
    </div>
  );
}
