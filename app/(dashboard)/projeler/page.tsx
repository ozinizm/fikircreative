"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { TaskDetailModal } from "@/components/projeler/TaskDetailModal";
import { useToast } from "@/components/ui/Toast";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  deadline?: string;
  tags?: string;
}

export default function ProjelerPage() {
  const { toast, showToast, hideToast, ToastComponent } = useToast();
  const [tasks, setTasks] = useState<Record<string, Task[]>>({
    TODO: [],
    IN_PROGRESS: [],
    REVIEW: [],
    COMPLETED: [],
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    deadline: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const data = await response.json();
        const grouped: Record<string, Task[]> = {
          TODO: [],
          IN_PROGRESS: [],
          REVIEW: [],
          COMPLETED: [],
        };
        data.forEach((task: Task) => {
          if (grouped[task.status]) {
            grouped[task.status].push(task);
          }
        });
        setTasks(grouped);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({
          title: "",
          description: "",
          status: "TODO",
          priority: "MEDIUM",
          deadline: "",
        });
        fetchTasks();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const updateTask = async (taskId: string, updates: any) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, ...updates }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showToast("Görev başarıyla silindi", "success");
        fetchTasks();
      } else {
        showToast("Görev silinirken hata oluştu", "error");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      showToast("Bir hata oluştu", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const columns = [
    { key: "TODO", title: "Yapılacak", color: "border-gray-500" },
    { key: "IN_PROGRESS", title: "Çalışılıyor", color: "border-blue-500" },
    { key: "REVIEW", title: "Revizyonda", color: "border-yellow-500" },
    { key: "COMPLETED", title: "Tamamlandı", color: "border-green-500" },
  ];

  return (
    <div className="p-6">
      {ToastComponent}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Projeler & Görevler</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Yeni Görev
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.key} className="bg-[#1a1a1a] rounded-lg border border-[#252525] p-4">
            <div className={`flex items-center justify-between mb-4 pb-3 border-b-2 ${column.color}`}>
              <h3 className="text-white font-semibold">{column.title}</h3>
              <span className="text-gray-400 text-sm">{tasks[column.key].length}</span>
            </div>
            <div className="space-y-3">
              {tasks[column.key].map((task) => (
                <div
                  key={task.id}
                  className="bg-[#252525] p-3 rounded-lg border border-[#2a2a2a] hover:border-red-600 transition-all cursor-pointer"
                  draggable
                  onClick={() => setSelectedTask(task)}
                  onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const taskId = e.dataTransfer.getData("taskId");
                    updateTaskStatus(taskId, column.key);
                  }}
                >
                  <h4 className="text-white font-medium text-sm mb-2">{task.title}</h4>
                  {task.description && (
                    <p className="text-gray-400 text-xs mb-2">{task.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        task.priority === "HIGH"
                          ? "bg-red-500/20 text-red-400"
                          : task.priority === "MEDIUM"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {task.priority === "HIGH" ? "Yüksek" : task.priority === "MEDIUM" ? "Orta" : "Düşük"}
                    </span>
                    {task.deadline && (
                      <span className="text-xs text-gray-500">
                        {new Date(task.deadline).toLocaleDateString("tr-TR")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#252525] w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">Yeni Görev Ekle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Görev Adı *</label>
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
                <label className="block text-sm text-gray-400 mb-1">Durum</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                >
                  <option value="TODO">Yapılacak</option>
                  <option value="IN_PROGRESS">Çalışılıyor</option>
                  <option value="REVIEW">Revizyonda</option>
                  <option value="COMPLETED">Tamamlandı</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Öncelik</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
                >
                  <option value="LOW">Düşük</option>
                  <option value="MEDIUM">Orta</option>
                  <option value="HIGH">Yüksek</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Bitiş Tarihi</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
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

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}
