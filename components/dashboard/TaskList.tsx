"use client";

import { Circle, Clock, Sparkles } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  deadline?: string;
  project?: {
    client?: {
      name: string;
    };
  };
}

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks = [] }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-4 md:p-8">
        <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">Son Görevler</h2>
        <div className="text-center py-6 md:py-8">
          <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-red-400/50 mx-auto mb-3" />
          <p className="text-gray-400 text-sm md:text-base">Henüz görev bulunmuyor</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Son Görevler</h2>
      </div>

      <div className="space-y-2 md:space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="glass-card hover:bg-white/10 rounded-xl p-3 md:p-4 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                <div className="mt-1 flex-shrink-0">
                  <Circle size={18} className={`md:w-5 md:h-5 ${
                    task.status === "COMPLETED" ? "text-green-400 fill-green-400/20" : 
                    task.status === "IN_PROGRESS" ? "text-blue-400 fill-blue-400/20" : 
                    task.status === "REVIEW" ? "text-yellow-400 fill-yellow-400/20" : "text-gray-500"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm md:text-base mb-1 group-hover:text-red-300 transition-colors truncate">{task.title}</h3>
                  {task.description && (
                    <p className="text-xs md:text-sm text-gray-400 line-clamp-2">{task.description}</p>
                  )}
                  {task.project?.client?.name && (
                    <p className="text-xs text-red-400/70 mt-1 font-medium truncate">{task.project.client.name}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-3 flex-shrink-0">
                {task.deadline && (
                  <div className="flex items-center gap-1 md:gap-1.5 text-gray-400 text-xs md:text-sm">
                    <Clock size={12} className="md:w-3.5 md:h-3.5" />
                    <span className="hidden sm:inline">{new Date(task.deadline).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}</span>
                    <span className="sm:hidden">{new Date(task.deadline).toLocaleDateString("tr-TR", { day: "numeric", month: "numeric" })}</span>
                  </div>
                )}
                <span className={`px-2 py-0.5 md:py-1 text-xs rounded border whitespace-nowrap ${
                  task.priority === "HIGH" 
                    ? "bg-red-500/20 text-red-500 border-red-500/30"
                    : task.priority === "MEDIUM"
                    ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                    : "bg-blue-500/20 text-blue-500 border-blue-500/30"
                }`}>
                  {task.priority === "HIGH" ? "Yüksek" : task.priority === "MEDIUM" ? "Orta" : "Düşük"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => window.location.href = "/projeler"}
        className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-white transition-all"
      >
        Tüm Görevleri Görüntüle →
      </button>
    </div>
  );
}


