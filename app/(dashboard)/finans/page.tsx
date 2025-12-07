"use client";

import { useEffect, useState } from "react";
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: string;
  status: string;
  date: string;
  description?: string;
  client?: {
    name: string;
  };
}

export default function FinansPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "INCOME",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Admin kontrolü
  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({
          title: "",
          amount: "",
          type: "INCOME",
          description: "",
          date: new Date().toISOString().split("T")[0],
        });
        fetchTransactions();
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

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
          <h1 className="text-3xl font-bold text-white">Finans</h1>
          <p className="text-gray-400 mt-1">Gelir ve gider takibi</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Yeni İşlem
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#252525]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Toplam Gelir</span>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">₺{income.toLocaleString()}</p>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#252525]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Toplam Gider</span>
            <TrendingDown className="text-red-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">₺{expense.toLocaleString()}</p>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#252525]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Bakiye</span>
            <DollarSign className={balance >= 0 ? "text-green-500" : "text-red-500"} size={20} />
          </div>
          <p className={`text-3xl font-bold ${balance >= 0 ? "text-green-500" : "text-red-500"}`}>
            ₺{balance.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-lg border border-[#252525]">
        <div className="p-6 border-b border-[#252525]">
          <h2 className="text-xl font-bold text-white">Son İşlemler</h2>
        </div>
        <div className="divide-y divide-[#252525]">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="p-4 hover:bg-[#252525] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium">{transaction.title}</h3>
                  {transaction.description && (
                    <p className="text-gray-400 text-sm mt-1">{transaction.description}</p>
                  )}
                  {transaction.client && (
                    <p className="text-gray-500 text-xs mt-1">{transaction.client.name}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(transaction.date).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      transaction.type === "INCOME" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}₺{transaction.amount.toLocaleString()}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      transaction.status === "COMPLETED"
                        ? "bg-green-500/20 text-green-400"
                        : transaction.status === "PENDING"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {transaction.status === "COMPLETED"
                      ? "Tamamlandı"
                      : transaction.status === "PENDING"
                      ? "Beklemede"
                      : "İptal"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#252525] w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">Yeni İşlem Ekle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">İşlem Adı *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tutar *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tür *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                >
                  <option value="INCOME">Gelir</option>
                  <option value="EXPENSE">Gider</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tarih *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
