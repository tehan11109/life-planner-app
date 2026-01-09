import { LucideIcon, Plus } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onAdd?: () => void;
  addLabel?: string;
}

export function PageHeader({ icon: Icon, title, subtitle, onAdd, addLabel = 'Add New' }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
        </div>
      </div>
      {onAdd && (
        <button onClick={onAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {addLabel}
        </button>
      )}
    </div>
  );
}
