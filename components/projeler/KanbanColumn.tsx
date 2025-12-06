import { Plus, Calendar, Tag } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  tags: string[];
}

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onAddTask: () => void;
}

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
};

export function KanbanColumn({ title, tasks, onAddTask }: KanbanColumnProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-semibold">{title}</h3>
          <span className="px-2 py-0.5 bg-[#252525] text-gray-400 text-xs rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="p-1 hover:bg-[#252525] rounded transition-all"
        >
          <Plus size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-[#252525] border border-[#2a2a2a] rounded-lg p-4 hover:border-[#3a3a3a] transition-all cursor-pointer group"
          >
            {/* Priority Indicator */}
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-1 h-full ${priorityColors[task.priority]} rounded-full`} />
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1 group-hover:text-red-600 transition-colors">
                  {task.title}
                </h4>
                <p className="text-sm text-gray-400">{task.description}</p>
              </div>
            </div>

            {/* Deadline */}
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
              <Calendar size={14} />
              <span>{task.deadline}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[#1a1a1a] text-xs text-gray-400 rounded border border-[#2a2a2a]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Add Task Button */}
        {tasks.length === 0 && (
          <button
            onClick={onAddTask}
            className="w-full py-8 border-2 border-dashed border-[#2a2a2a] rounded-lg text-gray-400 hover:border-[#3a3a3a] hover:text-white transition-all"
          >
            + Görev Ekle
          </button>
        )}
      </div>
    </div>
  );
}
