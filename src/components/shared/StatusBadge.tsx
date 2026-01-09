import { Status } from '@/types/planner';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: Status;
}

const statusConfig = {
  pending: { label: 'Pending', className: 'status-pending' },
  'in-progress': { label: 'In Progress', className: 'status-progress' },
  completed: { label: 'Completed', className: 'status-completed' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={cn('status-badge', config.className)}>
      {config.label}
    </span>
  );
}
