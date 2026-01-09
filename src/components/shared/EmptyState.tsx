import { LucideIcon, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="glass-card p-12 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">{description}</p>
      {onAction && actionLabel && (
        <button onClick={onAction} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
