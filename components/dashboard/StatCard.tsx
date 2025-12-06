import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
}

export function StatCard({ title, value, change, isPositive, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#3a3a3a] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-[#252525] rounded-lg">
          <Icon size={24} className="text-red-600" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {change}
        </div>
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
