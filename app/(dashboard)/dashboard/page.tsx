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
    <div className="space-y-4 md:space-y-6 p-3 md:p-6">
      {/* Header with Gradient */}
      <div className="glass-card rounded-2xl p-4 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-pink-500/10"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white via-red-200 to-orange-200 bg-clip-text text-transparent">
              Gösterge Paneli
            </h1>
            <p className="text-gray-400 mt-1 md:mt-2 text-sm md:text-lg">Genel bakış ve güncel durum</p>
          </div>
          <div className="flex gap-2 md:gap-3 w-full md:w-auto">
            <button 
              onClick={() => window.location.href = "/projeler"}
              className="flex-1 md:flex-none px-3 md:px-6 py-2 md:py-3 glass-card hover:bg-white/10 text-white rounded-xl transition-all border border-white/20 backdrop-blur-xl font-medium text-sm md:text-base"
            >
              Yeni Görev
            </button>
            <button 
              onClick={() => window.location.href = "/musteriler"}
              className="flex-1 md:flex-none px-3 md:px-6 py-2 md:py-3 glass-button text-white rounded-xl transition-all flex items-center justify-center gap-2 font-medium shadow-lg text-sm md:text-base"
            >
              <Plus size={18} className="md:w-5 md:h-5" />
              <span className="hidden sm:inline">Yeni Müşteri</span>
              <span className="sm:hidden">Müşteri</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <TaskList tasks={stats?.recentTasks || []} />
        </div>
        <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
          <CalendarWidget />
          <div className="hidden md:block">
            <FinanceChart />
          </div>
        </div>
      </div>
      
      {/* FinanceChart - Mobilde altta tam genişlikte */}
      <div className="block md:hidden">
        <FinanceChart />
      </div>
    </div>
  );
}

