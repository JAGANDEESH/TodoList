import type { Task, TaskStatus } from '@/types/task';
import { useTasks } from '@/contexts/TaskContext';
import KanbanColumn from './KanbanColumn';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';

interface KanbanBoardProps {
  onEditTask: (task: Task) => void;
}

const columns: TaskStatus[] = ['todo', 'in-progress', 'done'];

const KanbanBoard = ({ onEditTask }: KanbanBoardProps) => {
  const { tasks, moveTask } = useTasks();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    if (columns.includes(newStatus)) {
      moveTask(taskId, newStatus);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter(t => t.status === status)}
            onEditTask={onEditTask}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
