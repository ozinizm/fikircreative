"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

const daysOfWeek = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

export function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
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

  const eventDays = [7, 14, 21, 28]; // Days with events

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon size={20} className="text-red-400" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Takvim</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevMonth}
            className="p-2 glass-card hover:bg-white/10 rounded-lg transition-all"
          >
            <ChevronLeft size={18} className="text-gray-400" />
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-2 glass-card hover:bg-white/10 rounded-lg transition-all"
          >
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-bold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
          {monthNames[month]} {year}
        </p>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-xs text-red-400/70 font-semibold">
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
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`
                aspect-square flex items-center justify-center rounded-xl text-sm font-semibold transition-all relative group
                ${isToday 
                  ? "glass-button text-white shadow-glow" 
                  : isSelected
                  ? "bg-red-500/20 border border-red-500/50 text-white"
                  : "glass-card hover:bg-white/10 text-gray-300"
                }
              `}
            >
              {day}
              {hasEvent && !isToday && (
                <span className="absolute bottom-1 w-1.5 h-1.5 bg-red-500 rounded-full group-hover:scale-125 transition-transform" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 dark:border-white/10 light:border-gray-200">
        <p className="text-sm text-red-400 mb-3 font-semibold">Yaklaşan Etkinlikler</p>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm glass-card p-2 rounded-lg hover:bg-white/10 transition-all cursor-pointer">
            <div className="w-2 h-2 bg-red-500 rounded-full shadow-glow" />
            <span className="text-white font-medium">Müşteri Toplantısı</span>
          </div>
          <div className="flex items-center gap-3 text-sm glass-card p-2 rounded-lg hover:bg-white/10 transition-all cursor-pointer">
            <div className="w-2 h-2 bg-orange-500 rounded-full shadow-glow" />
            <span className="text-white font-medium">Proje Teslimi</span>
          </div>
        </div>
      </div>
    </div>
  );
}

