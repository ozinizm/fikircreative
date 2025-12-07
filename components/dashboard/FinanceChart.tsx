"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { name: "Oca", gelir: 65000, gider: 45000 },
  { name: "Şub", gelir: 59000, gider: 42000 },
  { name: "Mar", gelir: 80000, gider: 51000 },
  { name: "Nis", gelir: 81000, gider: 56000 },
  { name: "May", gelir: 95000, gider: 55000 },
  { name: "Haz", gelir: 75000, gider: 60000 },
];

export function FinanceChart() {
  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={20} className="text-violet-400" />
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Gelir ve Gider Akışı</h2>
            </div>
            <p className="text-sm text-gray-400">Son 6 ay</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full shadow-glow" />
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
                <linearGradient id="violetGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <Line 
                type="monotone" 
                dataKey="gelir" 
                stroke="url(#violetGradient)" 
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", r: 5, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
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
