"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2 } from "lucide-react";

const daysOfWeek = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

interface Event {
  id: string;
  title: string;
  description?: string;
  type: string;
  startDate: string;
  endDate?: string;
  color?: string;
}

export function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

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

  // Belirli bir gün için eventleri getir
  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getDate() === day && 
             eventDate.getMonth() === month && 
             eventDate.getFullYear() === year;
    });
  };

  // Yaklaşan eventleri getir (sonraki 5 gün)
  const getUpcomingEvents = () => {
    const now = new Date();
    const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
    
    return events
      .filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate >= now && eventDate <= fiveDaysLater;
      })
      .slice(0, 3)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  };

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

  const upcomingEvents = getUpcomingEvents();

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-4 md:p-6">
        <div className="flex items-center justify-center h-48 md:h-64">
          <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-red-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon size={18} className="md:w-5 md:h-5 text-red-400" />
          <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Takvim</h2>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <button 
            onClick={handlePrevMonth}
            className="p-1.5 md:p-2 glass-card hover:bg-white/10 rounded-lg transition-all"
          >
            <ChevronLeft size={16} className="md:w-[18px] md:h-[18px] text-gray-400" />
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-1.5 md:p-2 glass-card hover:bg-white/10 rounded-lg transition-all"
          >
            <ChevronRight size={16} className="md:w-[18px] md:h-[18px] text-gray-400" />
          </button>
        </div>
      </div>

      <div className="mb-3 md:mb-4">
        <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
          {monthNames[month]} {year}
        </p>
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-1 md:mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-[10px] md:text-xs text-red-400/70 font-semibold">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />;
          }

          const isToday = isCurrentMonth && day === today;
          const dayEvents = getEventsForDay(day);
          const hasEvent = dayEvents.length > 0;
          const isSelected = selectedDay === day;
          const isHovered = hoveredDay === day;

          return (
            <div key={day} className="relative group">
              <button
                onClick={() => handleDayClick(day)}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`
                  w-full aspect-square flex items-center justify-center rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all relative
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
                  <span className="absolute bottom-0.5 md:bottom-1 w-1 h-1 md:w-1.5 md:h-1.5 bg-red-500 rounded-full group-hover:scale-125 transition-transform" />
                )}
              </button>
              
              {/* Hover Tooltip - Sadece desktop'ta göster */}
              {isHovered && hasEvent && (
                <div className="hidden md:block absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 glass-card p-3 rounded-xl shadow-xl border border-white/20">
                  <div className="space-y-2">
                    {dayEvents.map(event => (
                      <div key={event.id} className="text-xs">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${event.color ? `bg-${event.color}-500` : 'bg-red-500'}`} />
                          <span className="font-semibold text-white">{event.title}</span>
                        </div>
                        {event.description && (
                          <p className="text-gray-400 ml-4 mt-1">{event.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/10 dark:border-white/10 light:border-gray-200">
        <p className="text-xs md:text-sm text-red-400 mb-2 md:mb-3 font-semibold">Yaklaşan Etkinlikler</p>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-2">
            {upcomingEvents.map(event => (
              <div key={event.id} className="flex items-start gap-2 md:gap-3 text-xs md:text-sm glass-card p-2 rounded-lg hover:bg-white/10 transition-all cursor-pointer">
                <div className={`w-1.5 h-1.5 md:w-2 md:h-2 mt-1 rounded-full shadow-glow flex-shrink-0 ${event.color ? `bg-${event.color}-500` : 'bg-red-500'}`} />
                <div className="flex-1 min-w-0">
                  <span className="text-white font-medium block truncate">{event.title}</span>
                  {event.description && (
                    <span className="text-gray-400 text-xs line-clamp-1">{event.description}</span>
                  )}
                  <span className="text-gray-500 text-[10px] md:text-xs block mt-0.5 md:mt-1">
                    {new Date(event.startDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-xs md:text-sm">Yaklaşan etkinlik yok</p>
        )}
      </div>
    </div>
  );
}

