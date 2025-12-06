"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Gelir ve Gider Akışı</h2>
          <p className="text-sm text-gray-400">Son 6 ay</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full" />
            <span className="text-sm text-gray-400">Gelir</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full" />
            <span className="text-sm text-gray-400">Gider</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis 
              dataKey="name" 
              stroke="#666" 
              style={{ fontSize: "12px" }}
            />
            <YAxis 
              stroke="#666" 
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => `₺${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value: number) => [`₺${value.toLocaleString()}`, ""]}
            />
            <Line 
              type="monotone" 
              dataKey="gelir" 
              stroke="#dc2626" 
              strokeWidth={2}
              dot={{ fill: "#dc2626", r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="gider" 
              stroke="#2563eb" 
              strokeWidth={2}
              dot={{ fill: "#2563eb", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
