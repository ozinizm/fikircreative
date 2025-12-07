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
      <div className="glass-card rounded-2xl p-8">
        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">Son Görevler</h2>
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-violet-400/50 mx-auto mb-3" />
          <p className="text-gray-400">Henüz görev bulunmuyor</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Son Görevler</h2>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="glass-card hover:bg-white/10 rounded-xl p-4 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">
                  <Circle size={20} className={
                    task.status === "COMPLETED" ? "text-green-400 fill-green-400/20" : 
                    task.status === "IN_PROGRESS" ? "text-blue-400 fill-blue-400/20" : 
                    task.status === "REVIEW" ? "text-yellow-400 fill-yellow-400/20" : "text-gray-500"
                  } />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1 group-hover:text-violet-300 transition-colors">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-gray-400">{task.description}</p>
                  )}
                  {task.project?.client?.name && (
                    <p className="text-xs text-violet-400/70 mt-1 font-medium">{task.project.client.name}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {task.deadline && (
                  <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <Clock size={14} />
                    {new Date(task.deadline).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                  </div>
                )}
                <span className={`px-2 py-1 text-xs rounded border ${
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

