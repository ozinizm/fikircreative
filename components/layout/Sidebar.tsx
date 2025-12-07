"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Calendar,
  FileText,
  DollarSign,
  HardDrive,
  Settings,
  Menu,
  UserCog,
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
  const isAdmin = session?.user?.role === "ADMIN";
  
  // Admin değilse adminOnly menüleri filtrele
  const menuItems = allMenuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside className="w-64 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FC</span>
          </div>
          <span className="font-bold text-lg">Fikir AgencyOS</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${
                      isActive
                        ? "bg-red-600 text-white"
                        : "text-gray-400 hover:bg-[#252525] hover:text-white"
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">AV</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Ali Veli</p>
            <p className="text-xs text-gray-400">ali@fikir.agency</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
