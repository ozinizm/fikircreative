"use client";

import { X, Calendar, Tag, Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { useState } from "react";

interface TaskDetailModalProps {
  task: {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    deadline?: string;
    tags?: string;
  };
  onClose: () => void;
  onUpdate: (taskId: string, updates: any) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskDetailModal({ task, onClose, onUpdate, onDelete }: TaskDetailModalProps) {
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [description, setDescription] = useState(task.description || "");
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    await onUpdate(task.id, { status: newStatus });
  };

  const handleSave = async () => {
    await onUpdate(task.id, {
      status,
      priority,
      description,
    });
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const newImages: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        if (newImages.length === files.length) {
          setImages([...images, ...newImages]);
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-[#1a1a1a] rounded-lg border border-[#252525] w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#252525]">
          <h2 className="text-2xl font-bold text-white">{task.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Selection */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Durum</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: "TODO", label: "Yapılacak", color: "border-gray-500 hover:bg-gray-500/20" },
                { value: "IN_PROGRESS", label: "Çalışılıyor", color: "border-blue-500 hover:bg-blue-500/20" },
                { value: "REVIEW", label: "Revizyonda", color: "border-yellow-500 hover:bg-yellow-500/20" },
                { value: "COMPLETED", label: "Tamamlandı", color: "border-green-500 hover:bg-green-500/20" },
              ].map((s) => (
                <button
                  key={s.value}
                  onClick={() => handleStatusChange(s.value)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    status === s.value
                      ? `${s.color} border-opacity-100 bg-opacity-20`
                      : `${s.color} border-opacity-30`
                  } text-white`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Öncelik</label>
            <div className="flex gap-2">
              {[
                { value: "LOW", label: "Düşük", color: "bg-blue-500/20 text-blue-400" },
                { value: "MEDIUM", label: "Orta", color: "bg-yellow-500/20 text-yellow-400" },
                { value: "HIGH", label: "Yüksek", color: "bg-red-500/20 text-red-400" },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    priority === p.value ? p.color : "bg-[#252525] text-gray-400"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Açıklama</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white focus:outline-none focus:border-red-600"
              placeholder="Görev açıklaması..."
            />
          </div>

          {/* Deadline */}
          {task.deadline && (
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={18} />
              <span>Bitiş: {new Date(task.deadline).toLocaleDateString("tr-TR")}</span>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Görseller</label>
            <div className="space-y-3">
              <label className="flex items-center gap-2 px-4 py-2 bg-[#252525] border border-[#2a2a2a] rounded-lg cursor-pointer hover:bg-[#2a2a2a] transition-all w-fit">
                <Upload size={18} className="text-gray-400" />
                <span className="text-white text-sm">Görsel Yükle</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {uploading && (
                <div className="text-sm text-gray-400">Yükleniyor...</div>
              )}

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Görev görseli ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-[#252525]"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {images.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-[#252525] rounded-lg">
                  <ImageIcon size={48} className="text-gray-600 mb-2" />
                  <p className="text-gray-500 text-sm">Henüz görsel eklenmedi</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-[#252525]">
          <button
            onClick={() => {
              if (onDelete && confirm("Bu görevi silmek istediğinizden emin misiniz?")) {
                onDelete(task.id);
                onClose();
              }
            }}
            className="px-4 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
          >
            Görevi Sil
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#252525] text-white rounded-lg hover:bg-[#2a2a2a] transition-all"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
