import { useAuth } from '@/contexts/AuthContext';
import { LogOut, LayoutGrid, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  view: 'list' | 'kanban';
  onViewChange: (v: 'list' | 'kanban') => void;
  onAddTask: () => void;
}

const Navbar = ({ view, onViewChange, onAddTask }: NavbarProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">T</span>
          </div>
          <h1 className="text-lg font-semibold text-foreground">TaskFlow</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => onViewChange('list')}
              className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewChange('kanban')}
              className={`p-2 rounded-md transition-colors ${view === 'kanban' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          <Button size="sm" onClick={onAddTask} className="gradient-primary text-primary-foreground border-0 gap-1.5">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Task</span>
          </Button>

          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.name}</span>
            <button onClick={logout} className="p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
