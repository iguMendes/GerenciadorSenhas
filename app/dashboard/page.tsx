"use client";
import { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import FormFields from "../components/formFields";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log(currentUser.photoURL)
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
    <div className="min-h-screen flex flex-col items-center justify-start space-y-4 pt-3 pr-2 pl-5">
      {user ? (
        <>
        <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-500 text-sm text-white rounded-md hover:bg-red-600 transition translate-x-150"
          >
            LogOut
          </button> 
          <div className="flex items-center space-x-4">
            <img 
              src={user.photoURL || "/default-avatar.png"}
              alt="Foto de perfil"
              className="w-20 h-20 rounded-full border"
            />
            <h2 className="text-lg font-semibold">{user.displayName}</h2>
          </div>
                   
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
