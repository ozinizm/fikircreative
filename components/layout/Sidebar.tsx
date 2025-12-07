"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { APP_CONFIG } from "@/lib/config";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Calendar,
  FileText,
  DollarSign,
  HardDrive,
  Settings,
  UserCog,
  Sun,
  Moon,
} from "lucide-react";

const allMenuItems = [
  { icon: LayoutDashboard, label: "Gösterge Paneli", href: "/dashboard" },
  { icon: CheckSquare, label: "Projeler", href: "/projeler" },
  { icon: Users, label: "Müşteriler", href: "/musteriler" },
  { icon: FileText, label: "Raporlar", href: "/raporlar" },
  { icon: Calendar, label: "Takvim", href: "/takvim" },
  { icon: DollarSign, label: "Finans", href: "/finans", adminOnly: true },
  { icon: HardDrive, label: "Ekipman", href: "/ekipman" },
  { icon: UserCog, label: "Kullanıcılar", href: "/kullanicilar", adminOnly: true },
  { icon: Settings, label: "Ayarlar", href: "/ayarlar" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const isAdmin = session?.user?.role === "ADMIN";
  
  // Admin değilse adminOnly menüleri filtrele
  const menuItems = allMenuItems.filter(item => !item.adminOnly || isAdmin);

  // Tema değiştiğinde logo değişsin
  const currentLogo = theme === "dark" ? APP_CONFIG.logo.sidebar : APP_CONFIG.logo.icon;

  return (
    <aside className="w-64 glass-sidebar flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 dark:border-white/10 light:border-gray-200">
        <div className="flex items-center gap-3">
          {currentLogo ? (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
              <Image 
                src={currentLogo} 
                alt={APP_CONFIG.name}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">{APP_CONFIG.logo.text}</span>
            </div>
          )}
          <span className="font-bold text-lg bg-gradient-to-r from-white to-gray-300 dark:from-white dark:to-gray-300 light:from-gray-900 light:to-gray-600 bg-clip-text text-transparent">
            {APP_CONFIG.name}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden
                    ${
                      isActive
                        ? "glass-button text-white shadow-glow"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 animate-pulse" />
                  )}
                  <Icon size={20} className="relative z-10" />
                  <span className="text-sm font-medium relative z-10">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Theme Toggle */}
      <div className="px-4 py-3">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full glass-card hover:bg-white/10 px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-3 group"
        >
          {theme === "dark" ? (
            <>
              <Sun size={20} className="text-yellow-400 group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-sm font-medium">Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={20} className="text-red-400 group-hover:rotate-12 transition-transform duration-500" />
              <span className="text-sm font-medium">Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="glass-card rounded-xl p-3 hover:bg-white/10 transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center ring-2 ring-red-500/30 ring-offset-2 ring-offset-transparent">
              <span className="text-white font-semibold text-sm">
                {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : "??"}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{session?.user?.name || "Kullanıcı"}</p>
              <p className="text-xs text-gray-400">{session?.user?.email || ""}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

