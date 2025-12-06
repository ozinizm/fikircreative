import { ChevronRight } from "lucide-react";

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
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#3a3a3a] transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${client.color} rounded-lg flex items-center justify-center`}>
          <span className="text-white font-bold text-lg">{client.logo}</span>
        </div>
        <ChevronRight size={20} className="text-gray-400 group-hover:text-white transition-colors" />
      </div>

      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-red-600 transition-colors">
        {client.name}
      </h3>
      <p className="text-sm text-gray-400">{client.contact}</p>

      <div className="mt-4 pt-4 border-t border-[#2a2a2a] flex items-center justify-between">
        <div className="text-sm">
          <p className="text-gray-400 mb-1">Aktif Proje</p>
          <p className="text-white font-semibold">3 Proje</p>
        </div>
        <div className="text-sm text-right">
          <p className="text-gray-400 mb-1">Son İletişim</p>
          <p className="text-white font-semibold">2 gün önce</p>
        </div>
      </div>
    </div>
  );
}
