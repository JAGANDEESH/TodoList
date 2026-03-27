import type { Task, TaskStatus } from '@/types/task';
import { useTasks } from '@/contexts/TaskContext';
import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Circle, Loader2, CheckCircle2 } from 'lucide-react';

const statusConfig: Record<TaskStatus, { label: string; icon: React.ReactNode; color: string }> = {
  'todo': { label: 'Todo', icon: <Circle className="h-4 w-4" />, color: 'text-muted-foreground' },
  'in-progress': { label: 'In Progress', icon: <Loader2 className="h-4 w-4" />, color: 'text-primary' },
  'done': { label: 'Done', icon: <CheckCircle2 className="h-4 w-4" />, color: 'text-success' },
};

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const KanbanColumn = ({ status, tasks, onEditTask }: KanbanColumnProps) => {
  const config = statusConfig[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex-1 min-w-[280px] max-w-[400px]">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className={config.color}>{config.icon}</span>
        <h3 className="text-sm font-semibold text-foreground">{config.label}</h3>
        <span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">{tasks.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`space-y-2 min-h-[200px] rounded-lg p-2 transition-colors ${isOver ? 'bg-primary/5 ring-2 ring-primary/20' : 'bg-muted/30'}`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} isDraggable />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-24 text-xs text-muted-foreground">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
