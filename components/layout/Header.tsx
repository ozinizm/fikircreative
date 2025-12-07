"use client";

import { Bell, Search, User, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { NotificationBell } from "./NotificationBell";

export function Header() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="h-16 glass-header flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-400 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Ara..."
            className="w-full glass-input text-white pl-10 pr-4 py-2 rounded-xl transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <NotificationBell />

        {/* User Info */}
        {session?.user && (
          <div className="glass-card px-4 py-2 rounded-xl">
            <div className="text-right">
              <p className="text-sm text-white font-medium">{session.user.name}</p>
              <p className="text-xs text-red-400">{session.user.role === "ADMIN" ? "Admin" : "Kullanıcı"}</p>
            </div>
          </div>
        )}

        {/* User Menu */}
        <div className="relative group">
          <button className="glass-card hover:bg-white/10 p-2 rounded-xl transition-all">
            <User size={20} className="text-gray-300" />
          </button>
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all scale-95 group-hover:scale-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <LogOut size={18} />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

