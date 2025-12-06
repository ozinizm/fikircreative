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
    <header className="h-16 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Ara..."
            className="w-full bg-[#252525] text-white pl-10 pr-4 py-2 rounded-lg border border-[#2a2a2a] focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <NotificationBell />

        {/* User Info */}
        {session?.user && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-white font-medium">{session.user.name}</p>
              <p className="text-xs text-gray-400">{session.user.role === "ADMIN" ? "Admin" : "Kullanıcı"}</p>
            </div>
          </div>
        )}

        {/* User Menu */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-all">
            <User size={20} />
          </button>
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-all"
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
