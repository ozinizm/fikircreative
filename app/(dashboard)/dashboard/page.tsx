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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gösterge Paneli</h1>
          <p className="text-gray-400 mt-1">Genel bakış ve güncel durum</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.location.href = "/projeler"}
            className="px-4 py-2 bg-[#252525] text-white rounded-lg hover:bg-[#2a2a2a] transition-all border border-[#2a2a2a]"
          >
            Yeni Görev
          </button>
          <button 
            onClick={() => window.location.href = "/musteriler"}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Yeni Müşteri
          </button>
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
