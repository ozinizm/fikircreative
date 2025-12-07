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
    <div className="glass-card glass-hover rounded-2xl p-4 md:p-6 group relative overflow-hidden">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div className="p-2 md:p-3 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-300">
            <Icon size={20} className="md:w-6 md:h-6 text-red-400" />
          </div>
          <div className={`flex items-center gap-1 text-xs md:text-sm font-semibold px-2 md:px-3 py-1 rounded-full backdrop-blur-sm ${
            isPositive 
              ? "bg-green-500/20 text-green-400 border border-green-500/30" 
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}>
            {isPositive ? <TrendingUp size={14} className="md:w-4 md:h-4" /> : <TrendingDown size={14} className="md:w-4 md:h-4" />}
            {change}
          </div>
        </div>
        <h3 className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2 font-medium">{title}</h3>
        <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {value}
        </p>
      </div>
      
      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/50 to-orange-500/50 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
    </div>
  );
}

