import { useState } from 'react';
import { Target as TargetIcon, Edit2, Trash2, Calendar } from 'lucide-react';
import { usePlannerData } from '@/hooks/usePlannerData';
import { useSubscription } from '@/hooks/useSubscription';
import { Target, Status } from '@/types/planner';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { EmptyState } from '@/components/shared/EmptyState';
import { Modal } from '@/components/shared/Modal';
import { DeleteConfirm } from '@/components/shared/DeleteConfirm';
import { formatDate, getDaysUntil } from '@/lib/formatters';
import { cn } from '@/lib/utils';

export default function Targets() {
  const { data, addTarget, updateTarget, deleteTarget } = usePlannerData();
  const { isPremium, openPaywall } = useSubscription();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<Target | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Target | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as Status,
    progress: 0,
    deadline: '',
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', status: 'pending', progress: 0, deadline: '' });
    setEditingTarget(null);
  };

  const openAddModal = () => {
    // Free users can only create up to 6 targets
    if (!isPremium && data.targets.length >= 6) {
      openPaywall();
      return;
    }

    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (target: Target) => {
    setEditingTarget(target);
    setFormData({
      title: target.title,
      description: target.description,
      status: target.status,
      progress: target.progress,
      deadline: target.deadline,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.deadline) return;

    if (editingTarget) {
      updateTarget(editingTarget.id, formData);
    } else {
      addTarget(formData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={TargetIcon}
        title="Targets"
        subtitle="Specific milestones with deadlines"
        onAdd={openAddModal}
        addLabel="Add Target"
      />

      {data.targets.length === 0 ? (
        <EmptyState
          icon={TargetIcon}
          title="No targets set"
          description="Create specific, measurable targets with deadlines to track your progress."
          actionLabel="Add First Target"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid gap-4">
          {data.targets.map((target, index) => {
            const daysLeft = getDaysUntil(target.deadline);
            const isOverdue = daysLeft < 0 && target.status !== 'completed';
            const isUrgent = daysLeft <= 7 && daysLeft >= 0 && target.status !== 'completed';

            return (
              <div 
                key={target.id} 
                className={cn(
                  "category-card animate-slide-up",
                  isOverdue && "border-destructive/50",
                  isUrgent && "border-warning/50"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-foreground">{target.title}</h3>
                      <StatusBadge status={target.status} />
                    </div>
                    {target.description && (
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{target.description}</p>
                    )}
                    <div className="flex items-center gap-4 mb-3 flex-wrap">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Deadline: {formatDate(target.deadline)}</span>
                      </div>
                      {target.status !== 'completed' && (
                        <span className={cn(
                          "text-sm font-medium",
                          isOverdue && "text-destructive",
                          isUrgent && "text-warning",
                          !isOverdue && !isUrgent && "text-muted-foreground"
                        )}>
                          {isOverdue 
                            ? `${Math.abs(daysLeft)} days overdue` 
                            : `${daysLeft} days left`}
                        </span>
                      )}
                    </div>
                    <div className="max-w-md">
                      <ProgressBar 
                        value={target.progress} 
                        variant={target.status === 'completed' ? 'success' : isUrgent || isOverdue ? 'warning' : 'primary'} 
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEditModal(target)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(target)}
                      className="p-2 rounded-lg hover:bg-destructive/20 transition-colors text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingTarget ? 'Edit Target' : 'Add New Target'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field w-full"
              placeholder="Enter target title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field w-full min-h-[100px] resize-none"
              placeholder="Describe your target"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Deadline</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="input-field w-full"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
                className="input-field w-full"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Progress ({formData.progress}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingTarget ? 'Save Changes' : 'Add Target'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirm
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && deleteTarget(deleteConfirm.id)}
        title={deleteConfirm?.title || ''}
      />
    </div>
  );
}
