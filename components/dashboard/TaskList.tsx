"use client";

import { Circle, Clock } from "lucide-react";

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
      <div className="bg-[#1a1a1a] rounded-lg border border-[#252525] p-8">
        <h2 className="text-xl font-bold text-white mb-4">Son Görevler</h2>
        <p className="text-gray-400 text-center">Henüz görev bulunmuyor</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Son Görevler</h2>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-[#252525] border border-[#2a2a2a] rounded-lg p-4 hover:border-[#3a3a3a] transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Circle size={20} className={
                  task.status === "COMPLETED" ? "text-green-500" : 
                  task.status === "IN_PROGRESS" ? "text-blue-500" : 
                  task.status === "REVIEW" ? "text-yellow-500" : "text-gray-500"
                } />
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-gray-400">{task.description}</p>
                  )}
                  {task.project?.client?.name && (
                    <p className="text-xs text-gray-500 mt-1">{task.project.client.name}</p>
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

