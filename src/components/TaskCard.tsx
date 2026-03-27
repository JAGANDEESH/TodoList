import type { Task, TaskPriority } from '@/types/task';
import { useTasks } from '@/contexts/TaskContext';
import { Trash2, GripVertical, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  medium: { label: 'Medium', className: 'bg-warning/10 text-warning border-warning/20' },
  low: { label: 'Low', className: 'bg-success/10 text-success border-success/20' },
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  isDraggable?: boolean;
}

const TaskCard = ({ task, onEdit, isDraggable = false }: TaskCardProps) => {
  const { deleteTask, moveTask } = useTasks();
  const priority = priorityConfig[task.priority];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: !isDraggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer animate-fade-in"
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start gap-3">
        {isDraggable && (
          <button
            {...attributes}
            {...listeners}
            className="mt-0.5 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
            onClick={e => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-medium text-sm leading-snug ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.title}
            </h3>
            <button
              onClick={e => { e.stopPropagation(); deleteTask(task.id); }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priority.className}`}>
              {priority.label}
            </Badge>
            {task.status !== 'done' && (
              <button
                onClick={e => { e.stopPropagation(); moveTask(task.id, 'done'); }}
                className="text-[10px] text-muted-foreground hover:text-success transition-colors"
              >
                ✓ Complete
              </button>
            )}
            <span className="text-[10px] text-muted-foreground ml-auto flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(task.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
