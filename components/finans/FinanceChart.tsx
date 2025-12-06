"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { month: "Oca", gelir: 65000, gider: 45000 },
  { month: "Şub", gelir: 59000, gider: 42000 },
  { month: "Mar", gelir: 80000, gider: 51000 },
  { month: "Nis", gelir: 81000, gider: 56000 },
  { month: "May", gelir: 95000, gider: 55000 },
  { month: "Haz", gelir: 75000, gider: 60000 },
];

export function FinanceChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis 
            dataKey="month" 
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
          <Legend 
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={(value) => <span style={{ color: "#999" }}>{value === "gelir" ? "Gelir" : "Gider"}</span>}
          />
          <Line 
            type="monotone" 
            dataKey="gelir" 
            stroke="#dc2626" 
            strokeWidth={3}
            dot={{ fill: "#dc2626", r: 5 }}
            name="gelir"
          />
          <Line 
            type="monotone" 
            dataKey="gider" 
            stroke="#2563eb" 
            strokeWidth={3}
            dot={{ fill: "#2563eb", r: 5 }}
            name="gider"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
