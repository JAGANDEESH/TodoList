import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Task, TaskStatus, TaskPriority } from '@/types/task';
import { useAuth } from './AuthContext';
import { authFetch } from '@/lib/api';
import { toast } from 'sonner';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  addTask: (title: string, description: string, priority: TaskPriority) => Promise<void>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (id: string, status: TaskStatus) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | null>(null);

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tasks whenever the logged-in user changes
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }
    setIsLoading(true);
    authFetch('/api/tasks')
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setTasks(data.tasks))
      .catch(() => toast.error('Failed to load tasks'))
      .finally(() => setIsLoading(false));
  }, [user]);

  const addTask = useCallback(
    async (title: string, description: string, priority: TaskPriority) => {
      const res = await authFetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ title, description, priority }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create task');
      setTasks((prev) => [data.task, ...prev]);
    },
    [],
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
      const res = await authFetch(`/api/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update task');
      setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
    },
    [],
  );

  const deleteTask = useCallback(async (id: string) => {
    // Optimistic: remove immediately, revert on failure
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await authFetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || 'Failed to delete task');
      }
    } catch (err: unknown) {
      // Revert — re-fetch to get consistent state
      authFetch('/api/tasks')
        .then((r) => r.json())
        .then((d) => setTasks(d.tasks))
        .catch(() => {});
      toast.error(err instanceof Error ? err.message : 'Failed to delete task');
    }
  }, []);

  const moveTask = useCallback(async (id: string, status: TaskStatus) => {
    // Optimistic: update status immediately for snappy kanban drag UX
    const snapshot = tasks;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t,
      ),
    );
    try {
      const res = await authFetch(`/api/tasks/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTasks(snapshot);
        toast.error(data.error || 'Failed to update task status');
        return;
      }
      // Sync with server's authoritative timestamps
      setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
    } catch {
      setTasks(snapshot);
      toast.error('Network error — could not update task status');
    }
  }, [tasks]);

  return (
    <TaskContext.Provider value={{ tasks, isLoading, addTask, updateTask, deleteTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  );
};
