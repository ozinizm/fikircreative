import { ChevronRight, Building2 } from "lucide-react";

interface Client {
  id: string;
  name: string;
  contact: string;
  logo: string;
  color: string;
}

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <div className="glass-card glass-hover rounded-2xl p-6 cursor-pointer group relative overflow-hidden">
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-14 h-14 bg-gradient-to-br ${client.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <span className="text-white font-bold text-xl">{client.logo}</span>
          </div>
          <div className="glass-card px-3 py-1 rounded-full">
            <ChevronRight size={18} className="text-gray-400 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        <h3 className="text-white font-bold text-xl mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text group-hover:text-transparent transition-all">
          {client.name}
        </h3>
        <p className="text-sm text-gray-400 flex items-center gap-2">
          <Building2 size={14} />
          {client.contact}
        </p>

        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="text-sm">
            <p className="text-gray-400 mb-1 text-xs">Aktif Proje</p>
            <p className="text-white font-bold text-lg">3</p>
          </div>
          <div className="text-sm text-right">
            <p className="text-gray-400 mb-1 text-xs">Son İletişim</p>
            <p className="text-white font-bold text-lg">2g</p>
          </div>
        </div>
      </div>
      
      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/50 to-orange-500/50 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
    </div>
  );
}

