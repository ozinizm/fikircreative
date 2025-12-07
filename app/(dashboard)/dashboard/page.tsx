"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, DollarSign, CheckCircle2, Clock, Plus } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskList } from "@/components/dashboard/TaskList";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { FinanceChart } from "@/components/dashboard/FinanceChart";

interface Stats {
  clientCount: number;
  clientChange: string;
  taskCount: number;
  taskChange: string;
  pendingTaskCount: number;
  pendingChange: string;
  revenue: number;
  revenueChange: string;
  balance: number;
  recentTasks: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500/20 border-t-red-500"></div>
          <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Gradient */}
      <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-pink-500/10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-red-200 to-orange-200 bg-clip-text text-transparent">
              Gösterge Paneli
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Genel bakış ve güncel durum</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => window.location.href = "/projeler"}
              className="px-6 py-3 glass-card hover:bg-white/10 text-white rounded-xl transition-all border border-white/20 backdrop-blur-xl font-medium"
            >
              Yeni Görev
            </button>
            <button 
              onClick={() => window.location.href = "/musteriler"}
              className="px-6 py-3 glass-button text-white rounded-xl transition-all flex items-center gap-2 font-medium shadow-lg"
            >
              <Plus size={20} />
              Yeni Müşteri
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Müşteri"
          value={stats?.clientCount.toString() || "0"}
          change={stats?.clientChange ? `${Number(stats.clientChange) >= 0 ? '+' : ''}${stats.clientChange}%` : "0%"}
          isPositive={Number(stats?.clientChange || 0) >= 0}
          icon={Users}
        />
        <StatCard
          title="Toplam Görevler"
          value={stats?.taskCount.toString() || "0"}
          change={stats?.taskChange ? `${Number(stats.taskChange) >= 0 ? '+' : ''}${stats.taskChange}%` : "0%"}
          isPositive={Number(stats?.taskChange || 0) >= 0}
          icon={CheckCircle2}
        />
        <StatCard
          title="Bekleyen Görevler"
          value={stats?.pendingTaskCount.toString() || "0"}
          change={stats?.pendingChange ? `${Number(stats.pendingChange) >= 0 ? '+' : ''}${stats.pendingChange}%` : "0%"}
          isPositive={Number(stats?.pendingChange || 0) >= 0}
          icon={Clock}
        />
        <StatCard
          title="Aylık Gelir"
          value={`₺${stats?.revenue.toLocaleString() || "0"}`}
          change={stats?.revenueChange ? `${Number(stats.revenueChange) >= 0 ? '+' : ''}${stats.revenueChange}%` : "0%"}
          isPositive={Number(stats?.revenueChange || 0) >= 0}
          icon={DollarSign}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TaskList tasks={stats?.recentTasks || []} />
        </div>
        <div className="space-y-6">
          <CalendarWidget />
          <FinanceChart />
        </div>
      </div>
    </div>
  );
}

