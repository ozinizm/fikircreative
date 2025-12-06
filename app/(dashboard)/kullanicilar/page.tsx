"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string;
  createdAt: string;
}

export default function KullanicilarPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    position: "",
    phone: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = "/api/users";
      const method = editingUser ? "PATCH" : "POST";
      const body = editingUser
        ? { id: editingUser.id, ...formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await fetchUsers();
        setShowModal(false);
        setEditingUser(null);
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "USER",
          position: "",
          phone: "",
        });
      }
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      position: user.position || "",
      phone: "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
          <p className="text-gray-400 mt-2">Sistem kullanıcılarını yönetin</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({
              name: "",
              email: "",
              password: "",
              role: "USER",
              position: "",
              phone: "",
            });
            setShowModal(true);
          }}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
        >
          + Yeni Kullanıcı
        </button>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl border border-[#252525] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0d0d0d] border-b border-[#252525]">
            <tr>
              <th className="text-left p-4 font-semibold">Ad Soyad</th>
              <th className="text-left p-4 font-semibold">Email</th>
              <th className="text-left p-4 font-semibold">Pozisyon</th>
              <th className="text-left p-4 font-semibold">Rol</th>
              <th className="text-left p-4 font-semibold">Kayıt Tarihi</th>
              <th className="text-right p-4 font-semibold">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-[#252525] hover:bg-[#252525] transition-colors"
              >
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4 text-gray-400">{user.email}</td>
                <td className="p-4 text-gray-400">{user.position || "-"}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === "ADMIN"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-colors"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
                    disabled={user.id === session?.user?.id}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-xl border border-[#252525] w-full max-w-md">
            <div className="p-6 border-b border-[#252525]">
              <h2 className="text-xl font-bold">
                {editingUser ? "Kullanıcı Düzenle" : "Yeni Kullanıcı"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-[#0d0d0d] border border-[#252525] rounded-lg px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-[#0d0d0d] border border-[#252525] rounded-lg px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {editingUser ? "Şifre (Boş bırakın)" : "Şifre *"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-[#0d0d0d] border border-[#252525] rounded-lg px-4 py-2"
                  required={!editingUser}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Pozisyon</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="w-full bg-[#0d0d0d] border border-[#252525] rounded-lg px-4 py-2"
                  placeholder="Örn: Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Telefon</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-[#0d0d0d] border border-[#252525] rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rol *</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full bg-[#0d0d0d] border border-[#252525] rounded-lg px-4 py-2"
                >
                  <option value="USER">Kullanıcı</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(null);
                  }}
                  className="flex-1 px-4 py-2 bg-[#252525] hover:bg-[#333] rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
