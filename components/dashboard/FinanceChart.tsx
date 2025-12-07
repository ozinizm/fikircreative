"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Loader2 } from "lucide-react";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  date: string;
}

interface ChartData {
  name: string;
  gelir: number;
  gider: number;
}

export function FinanceChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      if (response.ok) {
        const transactions: Transaction[] = await response.json();
        processChartData(transactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (transactions: Transaction[]) => {
    const monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    const now = new Date();
    const chartData: ChartData[] = [];

    // Son 6 ayı hesapla
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthIndex = date.getMonth();
      
      chartData.push({
        name: monthNames[monthIndex],
        gelir: 0,
        gider: 0,
      });
    }

    // Transaction'ları aylara göre grupla
    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      const monthIndex = transactionDate.getMonth();
      const monthName = monthNames[monthIndex];
      
      const dataPoint = chartData.find(d => d.name === monthName);
      if (dataPoint) {
        if (transaction.type === "INCOME") {
          dataPoint.gelir += transaction.amount;
        } else if (transaction.type === "EXPENSE") {
          dataPoint.gider += transaction.amount;
        }
      }
    });

    setData(chartData);
  };

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-red-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={20} className="text-red-400" />
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Gelir ve Gider Akışı</h2>
            </div>
            <p className="text-sm text-gray-400">Son 6 ay</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-glow" />
              <span className="text-sm text-gray-300 font-medium">Gelir</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-glow" />
              <span className="text-sm text-gray-300 font-medium">Gider</span>
            </div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.3)" 
                style={{ fontSize: "12px", fontWeight: 500 }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.3)" 
                style={{ fontSize: "12px", fontWeight: 500 }}
                tickFormatter={(value) => `₺${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}
                formatter={(value: number) => [`₺${value.toLocaleString()}`, ""]}
              />
              <defs>
                <linearGradient id="redGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <Line 
                type="monotone" 
                dataKey="gelir" 
                stroke="url(#redGradient)" 
                strokeWidth={3}
                dot={{ fill: "#ef4444", r: 5, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="gider" 
                stroke="url(#blueGradient)" 
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 5, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

