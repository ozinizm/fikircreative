"use client";

import { useEffect, useState } from "react";
import { Plus, FileText, Download } from "lucide-react";

interface Report {
  id: string;
  title: string;
  type: string;
  content?: string;
  fileUrl?: string;
  status: string;
  createdAt: string;
}

export default function RaporlarPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "MONTHLY",
    content: "",
    status: "DRAFT",
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports");
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({
          title: "",
          type: "MONTHLY",
          content: "",
          status: "DRAFT",
        });
        fetchReports();
      }
    } catch (error) {
      console.error("Error creating report:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu raporu silmek istediğinizden emin misiniz?")) return;
    
    try {
      const response = await fetch(`/api/reports?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

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
          <h1 className="text-2xl font-bold text-white">Raporlar</h1>
          <p className="text-gray-400 text-sm mt-1">Rapor oluştur ve yönet</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Yeni Rapor
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-[#1a1a1a] rounded-lg border border-[#252525] p-6 hover:border-red-600 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-red-600/10 rounded-lg flex items-center justify-center">
                  <FileText className="text-red-500" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1">{report.title}</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        report.type === "MONTHLY"
                          ? "bg-blue-500/20 text-blue-400"
                          : report.type === "QUARTERLY"
                          ? "bg-green-500/20 text-green-400"
                          : report.type === "ANNUAL"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {report.type === "MONTHLY" ? "Aylık" : report.type === "QUARTERLY" ? "Üç Aylık" : report.type === "ANNUAL" ? "Yıllık" : "Özel"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        report.status === "COMPLETED"
                          ? "bg-green-500/20 text-green-400"
                          : report.status === "DRAFT"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {report.status === "COMPLETED" ? "Tamamlandı" : report.status === "DRAFT" ? "Taslak" : "Arşivlendi"}
                    </span>
                    <span className="text-gray-400">
                      {new Date(report.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                  {report.content && (
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">{report.content}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {report.fileUrl && (
                  <button className="p-2 hover:bg-[#252525] rounded-lg transition-all">
                    <Download className="text-gray-400" size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(report.id)}
                  className="px-3 py-1 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600/20 transition-all text-sm"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">Henüz rapor bulunmuyor</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#252525] w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">Yeni Rapor Oluştur</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Rapor Başlığı *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Rapor Türü</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                >
                  <option value="MONTHLY">Aylık</option>
                  <option value="QUARTERLY">Üç Aylık</option>
                  <option value="ANNUAL">Yıllık</option>
                  <option value="CUSTOM">Özel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">İçerik</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                  rows={5}
                  placeholder="Rapor içeriğini buraya yazın..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Durum</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                >
                  <option value="DRAFT">Taslak</option>
                  <option value="COMPLETED">Tamamlandı</option>
                  <option value="ARCHIVED">Arşivlendi</option>
                </select>
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
