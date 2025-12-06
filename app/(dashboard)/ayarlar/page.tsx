"use client";

import { useSession } from "next-auth/react";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function AyarlarPage() {
  const { data: session } = useSession();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("light", savedTheme === "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("light", newTheme === "light");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Ayarlar</h1>
        <p className="text-gray-400 mt-1">Sistem ayarları ve profil</p>
      </div>

      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#252525]">
        <h2 className="text-xl font-bold text-white mb-4">Profil Bilgileri</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-400">Ad Soyad</label>
            <p className="text-white">{session?.user?.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">E-posta</label>
            <p className="text-white">{session?.user?.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Rol</label>
            <p className="text-white">{session?.user?.role === "ADMIN" ? "Admin" : "Kullanıcı"}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#252525]">
        <h2 className="text-xl font-bold text-white mb-4">Tema</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Tema Modu</p>
            <p className="text-gray-400 text-sm">Aydınlık veya karanlık tema seçin</p>
          </div>
          <button
            onClick={toggleTheme}
            className="relative w-16 h-8 bg-[#252525] rounded-full transition-all hover:bg-[#2a2a2a]"
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-red-600 rounded-full transition-transform flex items-center justify-center ${
                theme === "light" ? "translate-x-8" : ""
              }`}
            >
              {theme === "dark" ? (
                <Moon size={14} className="text-white" />
              ) : (
                <Sun size={14} className="text-white" />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
