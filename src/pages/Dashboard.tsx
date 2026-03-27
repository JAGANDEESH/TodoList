import { useState } from 'react';
import type { Task } from '@/types/task';
import Navbar from '@/components/Navbar';
import TaskList from '@/components/TaskList';
import KanbanBoard from '@/components/KanbanBoard';
import TaskModal from '@/components/TaskModal';

const Dashboard = () => {
  const [view, setView] = useState<'list' | 'kanban'>('kanban');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar view={view} onViewChange={setView} onAddTask={handleAddTask} />
      <main className="container py-6">
        {view === 'kanban' ? (
          <KanbanBoard onEditTask={handleEditTask} />
        ) : (
          <TaskList onEditTask={handleEditTask} />
        )}
      </main>
      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} task={editingTask} />
    </div>
  );
};

export default Dashboard;
