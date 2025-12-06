"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  status: string;
  assignedTo?: string;
  createdAt: string;
}

export default function EkipmanPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    serialNumber: "",
    status: "AVAILABLE",
    assignedTo: "",
  });

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await fetch("/api/equipment");
      if (response.ok) {
        const data = await response.json();
        setEquipment(data);
      }
    } catch (error) {
      console.error("Error fetching equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({
          name: "",
          category: "",
          serialNumber: "",
          status: "AVAILABLE",
          assignedTo: "",
        });
        fetchEquipment();
      }
    } catch (error) {
      console.error("Error creating equipment:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ekipmanı silmek istediğinizden emin misiniz?")) return;
    
    try {
      const response = await fetch(`/api/equipment?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchEquipment();
      }
    } catch (error) {
      console.error("Error deleting equipment:", error);
    }
  };

  const filteredEquipment = equipment.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-white">Ekipman Yönetimi</h1>
          <p className="text-gray-400 text-sm mt-1">Şirket ekipmanlarını takip edin</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Yeni Ekipman
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Ekipman ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <div key={item.id} className="bg-[#1a1a1a] rounded-lg border border-[#252525] p-6 hover:border-red-600 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-1">{item.name}</h3>
                <p className="text-gray-400 text-sm">{item.category}</p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  item.status === "AVAILABLE"
                    ? "bg-green-500/20 text-green-400"
                    : item.status === "IN_USE"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {item.status === "AVAILABLE" ? "Müsait" : item.status === "IN_USE" ? "Kullanımda" : "Bakımda"}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Seri No:</span>
                <span className="text-white font-mono">{item.serialNumber}</span>
              </div>
              {item.assignedTo && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Atanan:</span>
                  <span className="text-white">{item.assignedTo}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Kayıt:</span>
                <span className="text-white">{new Date(item.createdAt).toLocaleDateString("tr-TR")}</span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="mt-4 w-full px-4 py-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600/20 transition-all text-sm"
            >
              Sil
            </button>
          </div>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">Ekipman bulunamadı</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#252525] w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">Yeni Ekipman Ekle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Ekipman Adı *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Kategori *</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Laptop, Monitör, Yazıcı, vs."
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Seri Numarası *</label>
                <input
                  type="text"
                  required
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Durum</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                >
                  <option value="AVAILABLE">Müsait</option>
                  <option value="IN_USE">Kullanımda</option>
                  <option value="MAINTENANCE">Bakımda</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Atanan Kişi</label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                />
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
