"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const daysOfWeek = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export function CalendarWidget() {
  const [currentDate] = useState(new Date());
  
  // Generate calendar days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    calendarDays.push(null);
  }
  
  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const today = new Date().getDate();
  const isCurrentMonth = 
    new Date().getMonth() === month && 
    new Date().getFullYear() === year;

  const eventDays = [29, 30, 31, 1, 2]; // Days with events

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Takvim</h2>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-[#252525] rounded">
            <ChevronLeft size={20} className="text-gray-400" />
          </button>
          <button className="p-1 hover:bg-[#252525] rounded">
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-bold text-white">Aralık 2025</p>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-xs text-gray-400 font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />;
          }

          const isToday = isCurrentMonth && day === today;
          const hasEvent = eventDays.includes(day);

          return (
            <button
              key={day}
              className={`
                aspect-square flex items-center justify-center rounded-xl text-sm font-semibold transition-all relative group
                ${isToday 
                  ? "glass-button text-white shadow-glow" 
                  : "glass-card hover:bg-white/10 text-gray-300"
                }
              `}
            >
              {day}
              {hasEvent && !isToday && (
                <span className="absolute bottom-1 w-1.5 h-1.5 bg-violet-500 rounded-full group-hover:scale-125 transition-transform" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-sm text-violet-400 mb-3 font-semibold">Yaklaşan Etkinlikler</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm glass-card p-2 rounded-lg hover:bg-white/10 transition-all cursor-pointer">
            <div className="w-2 h-2 bg-violet-500 rounded-full shadow-glow" />
            <span className="text-white font-medium">Müşteri Toplantısı</span>
          </div>
          <div className="flex items-center gap-3 text-sm glass-card p-2 rounded-lg hover:bg-white/10 transition-all cursor-pointer">
            <div className="w-2 h-2 bg-blue-500 rounded-full shadow-glow" />
            <span className="text-white font-medium">Proje Teslimi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
