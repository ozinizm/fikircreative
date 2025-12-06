"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone?: string;
  status: string;
  _count: {
    projects: number;
  };
}

export default function MusterilerPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { toast, showToast, hideToast, ToastComponent } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    monthlyFee: "",
    status: "ACTIVE"
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast("Müşteri başarıyla eklendi!", "success");
        setShowModal(false);
        setFormData({
          name: "",
          contact: "",
          email: "",
          phone: "",
          website: "",
          address: "",
          monthlyFee: "",
          status: "ACTIVE"
        });
        fetchClients();
      } else {
        showToast("Müşteri eklenirken bir hata oluştu", "error");
      }
    } catch (error) {
      console.error("Error creating client:", error);
      showToast("Bağlantı hatası", "error");
    }
  };

  const filteredClients = clients.filter((client: Client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-3xl font-bold text-white">Müşteriler</h1>
          <p className="text-gray-400 mt-1">Müşteri yönetimi ve CRM</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Yeni Müşteri
        </button>
      </div>

      <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#252525]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Müşteri ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Link key={client.id} href={`/musteriler/${client.id}`}>
            <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#252525] hover:border-red-600 transition-all cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {client.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold mb-1 truncate">{client.name}</h3>
                  <p className="text-gray-400 text-sm truncate">{client.contact}</p>
                  <p className="text-gray-500 text-xs mt-1 truncate">{client.email}</p>
                  {client.phone && (
                    <p className="text-gray-500 text-xs truncate">{client.phone}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      client.status === "ACTIVE"
                        ? "bg-green-500/20 text-green-400"
                        : client.status === "INACTIVE"
                        ? "bg-gray-500/20 text-gray-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {client.status === "ACTIVE" ? "Aktif" : client.status === "INACTIVE" ? "Pasif" : "Beklemede"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {client._count.projects} Proje
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">Müşteri bulunamadı</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#252525] w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">Yeni Müşteri Ekle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Firma Adı *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Yetkili Kişi *</label>
                <input
                  type="text"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">E-posta *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Telefon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Adres</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Aylık Ücret (₺)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.monthlyFee}
                  onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                  placeholder="Örn: 5000"
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
