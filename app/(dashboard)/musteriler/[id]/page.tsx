"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, Globe, MapPin, Trash2 } from "lucide-react";

interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  monthlyFee?: number;
  status: string;
  createdAt: string;
  projects: any[];
  transactions: any[];
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClient();
  }, [params.id]);

  const fetchClient = async () => {
    try {
      const response = await fetch("/api/clients");
      if (response.ok) {
        const clients = await response.json();
        const found = clients.find((c: Client) => c.id === params.id);
        setClient(found || null);
      }
    } catch (error) {
      console.error("Error fetching client:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu müşteriyi silmek istediğinizden emin misiniz?")) return;

    try {
      const response = await fetch(`/api/clients?id=${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/musteriler");
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Müşteri bulunamadı</p>
        <button
          onClick={() => router.push("/musteriler")}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Geri Dön
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/musteriler")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Geri
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
        >
          <Trash2 size={18} />
          Sil
        </button>
      </div>

      <div className="bg-[#1a1a1a] rounded-lg border border-[#252525] p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {client.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{client.name}</h1>
            <p className="text-gray-400 mb-4">{client.contact}</p>
            <span
              className={`px-3 py-1 rounded text-sm ${
                client.status === "ACTIVE"
                  ? "bg-green-500/20 text-green-400"
                  : client.status === "INACTIVE"
                  ? "bg-gray-500/20 text-gray-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {client.status === "ACTIVE" ? "Aktif" : client.status === "INACTIVE" ? "Pasif" : "Beklemede"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1a1a1a] rounded-lg border border-[#252525] p-6">
          <h2 className="text-xl font-bold text-white mb-4">İletişim Bilgileri</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-400">
              <Mail size={18} />
              <span>{client.email}</span>
            </div>
            {client.phone && (
              <div className="flex items-center gap-3 text-gray-400">
                <Phone size={18} />
                <span>{client.phone}</span>
              </div>
            )}
            {client.website && (
              <div className="flex items-center gap-3 text-gray-400">
                <Globe size={18} />
                <a href={client.website} target="_blank" rel="noopener noreferrer" className="hover:text-red-600">
                  {client.website}
                </a>
              </div>
            )}
            {client.address && (
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin size={18} />
                <span>{client.address}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg border border-[#252525] p-6">
          <h2 className="text-xl font-bold text-white mb-4">İstatistikler</h2>
          <div className="space-y-3">
            {client.monthlyFee && (
              <div className="flex justify-between pb-3 border-b border-[#252525]">
                <span className="text-gray-400">Aylık Ücret</span>
                <span className="text-green-400 font-semibold">
                  {client.monthlyFee.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Toplam Proje</span>
              <span className="text-white font-semibold">{client.projects?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Toplam İşlem</span>
              <span className="text-white font-semibold">{client.transactions?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Kayıt Tarihi</span>
              <span className="text-white font-semibold">
                {new Date(client.createdAt).toLocaleDateString("tr-TR")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-lg border border-[#252525] p-6">
        <h2 className="text-xl font-bold text-white mb-4">Projeler</h2>
        {client.projects && client.projects.length > 0 ? (
          <div className="space-y-3">
            {client.projects.map((project: any) => (
              <div key={project.id} className="bg-[#252525] p-4 rounded-lg border border-[#2a2a2a]">
                <h3 className="text-white font-medium">{project.title}</h3>
                {project.description && (
                  <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      project.status === "COMPLETED"
                        ? "bg-green-500/20 text-green-400"
                        : project.status === "IN_PROGRESS"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {project.status === "COMPLETED"
                      ? "Tamamlandı"
                      : project.status === "IN_PROGRESS"
                      ? "Çalışılıyor"
                      : project.status === "REVIEW"
                      ? "Revizyonda"
                      : "Yapılacak"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">Henüz proje bulunmuyor</p>
        )}
      </div>
    </div>
  );
}
