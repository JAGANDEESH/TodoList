import type { Task } from '@/types/task';
import { useTasks } from '@/contexts/TaskContext';
import TaskCard from './TaskCard';
import { ClipboardList } from 'lucide-react';

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

const TaskList = ({ onEditTask }: TaskListProps) => {
  const { tasks } = useTasks();

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-fade-in">
        <ClipboardList className="h-12 w-12 mb-4 opacity-40" />
        <p className="text-lg font-medium">No tasks yet</p>
        <p className="text-sm">Create your first task to get started</p>
      </div>
    );
  }

  const sections = [
    { label: 'Todo', tasks: tasks.filter(t => t.status === 'todo') },
    { label: 'In Progress', tasks: tasks.filter(t => t.status === 'in-progress') },
    { label: 'Done', tasks: tasks.filter(t => t.status === 'done') },
  ].filter(s => s.tasks.length > 0);

  return (
    <div className="space-y-6">
      {sections.map(section => (
        <div key={section.label}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{section.label} ({section.tasks.length})</h2>
          <div className="space-y-2">
            {section.tasks.map(task => (
              <TaskCard key={task.id} task={task} onEdit={onEditTask} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
