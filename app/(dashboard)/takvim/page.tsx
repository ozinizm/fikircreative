"use client";

import { useEffect, useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description?: string;
  type: string;
  startDate: string;
  endDate?: string;
  location?: string;
  color?: string;
  allDay: boolean;
}

export default function TakvimPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "EVENT",
    startDate: "",
    endDate: "",
    location: "",
    color: "#ef4444",
    allDay: false,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({
          title: "",
          description: "",
          type: "EVENT",
          startDate: "",
          endDate: "",
          location: "",
          color: "#ef4444",
          allDay: false,
        });
        fetchEvents();
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDay = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return events.filter(event => event.startDate.split('T')[0] === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const dayNames = ["Pzr", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }, (_, i) => i);

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
          <h1 className="text-2xl font-bold text-white">Takvim</h1>
          <p className="text-gray-400 text-sm mt-1">Etkinlik ve randevu yönetimi</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Yeni Etkinlik
        </button>
      </div>

      <div className="bg-[#1a1a1a] rounded-lg border border-[#252525] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={previousMonth} className="p-2 hover:bg-[#252525] rounded-lg transition-all">
              <ChevronLeft className="text-gray-400" size={20} />
            </button>
            <h2 className="text-xl font-bold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={nextMonth} className="p-2 hover:bg-[#252525] rounded-lg transition-all">
              <ChevronRight className="text-gray-400" size={20} />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1 rounded-lg text-sm ${viewMode === "month" ? "bg-red-600 text-white" : "bg-[#252525] text-gray-400"}`}
            >
              Ay
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 rounded-lg text-sm ${viewMode === "week" ? "bg-red-600 text-white" : "bg-[#252525] text-gray-400"}`}
            >
              Hafta
            </button>
            <button
              onClick={() => setViewMode("day")}
              className={`px-3 py-1 rounded-lg text-sm ${viewMode === "day" ? "bg-red-600 text-white" : "bg-[#252525] text-gray-400"}`}
            >
              Gün
            </button>
          </div>
        </div>

        {viewMode === "month" && (
          <div>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-gray-400 text-sm font-semibold py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square bg-[#0d0d0d] rounded-lg p-2"></div>
              ))}
              {days.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isToday = new Date().getDate() === day && 
                               new Date().getMonth() === currentDate.getMonth() &&
                               new Date().getFullYear() === currentDate.getFullYear();
                
                return (
                  <div
                    key={day}
                    className={`aspect-square bg-[#0d0d0d] rounded-lg p-2 hover:bg-[#252525] transition-all cursor-pointer ${
                      isToday ? "ring-2 ring-red-600" : ""
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${isToday ? "text-red-500" : "text-gray-300"}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-1 rounded truncate"
                          style={{ backgroundColor: event.color + "30", color: event.color }}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayEvents.length - 2} daha</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === "week" && (
          <div className="text-center py-12 text-gray-400">
            Hafta görünümü yakında eklenecek
          </div>
        )}

        {viewMode === "day" && (
          <div className="text-center py-12 text-gray-400">
            Gün görünümü yakında eklenecek
          </div>
        )}
      </div>

      {/* Yaklaşan Etkinlikler */}
      <div className="bg-[#1a1a1a] rounded-lg border border-[#252525] p-6">
        <h2 className="text-xl font-bold text-white mb-4">Yaklaşan Etkinlikler</h2>
        <div className="space-y-3">
          {events.slice(0, 5).map((event) => (
            <div key={event.id} className="flex items-center gap-4 p-3 bg-[#252525] rounded-lg">
              <div
                className="w-1 h-12 rounded-full"
                style={{ backgroundColor: event.color }}
              ></div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{event.title}</h3>
                <p className="text-gray-400 text-sm">
                  {new Date(event.startDate).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  event.type === "MEETING"
                    ? "bg-blue-500/20 text-blue-400"
                    : event.type === "TASK"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : event.type === "REMINDER"
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {event.type === "MEETING" ? "Toplantı" : event.type === "TASK" ? "Görev" : event.type === "REMINDER" ? "Hatırlatma" : "Etkinlik"}
              </span>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-center text-gray-400 py-8">Henüz etkinlik bulunmuyor</p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#252525] w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">Yeni Etkinlik Ekle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Başlık *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tür</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                >
                  <option value="EVENT">Etkinlik</option>
                  <option value="MEETING">Toplantı</option>
                  <option value="TASK">Görev</option>
                  <option value="REMINDER">Hatırlatma</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Başlangıç Tarihi *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Bitiş Tarihi</label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Konum</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Renk</label>
                <div className="flex gap-2">
                  {["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full ${formData.color === color ? "ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1a]" : ""}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allDay"
                  checked={formData.allDay}
                  onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="allDay" className="text-sm text-gray-400">Tüm gün</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-[#252525] text-white rounded-lg hover:bg-[#2a2a2a] transition-all"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
