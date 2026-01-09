import { useState } from 'react';
import { Flag, Edit2, Trash2 } from 'lucide-react';
import { usePlannerData } from '@/hooks/usePlannerData';
import { Goal, Status } from '@/types/planner';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { EmptyState } from '@/components/shared/EmptyState';
import { Modal } from '@/components/shared/Modal';
import { DeleteConfirm } from '@/components/shared/DeleteConfirm';

export default function Goals() {
  const { data, addGoal, updateGoal, deleteGoal } = usePlannerData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Goal | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as Status,
    progress: 0,
    dueDate: '',
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', status: 'pending', progress: 0, dueDate: '' });
    setEditingGoal(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      status: goal.status,
      progress: goal.progress,
      dueDate: goal.dueDate || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingGoal) {
      updateGoal(editingGoal.id, formData);
    } else {
      addGoal(formData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={Flag}
        title="Yearly Goals"
        subtitle="High-level objectives for the year"
        onAdd={openAddModal}
        addLabel="Add Goal"
      />

      {data.goals.length === 0 ? (
        <EmptyState
          icon={Flag}
          title="No goals yet"
          description="Start by adding your first yearly goal. Set ambitious objectives to guide your year."
          actionLabel="Add First Goal"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid gap-4">
          {data.goals.map((goal, index) => (
            <div 
              key={goal.id} 
              className="category-card animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground truncate">{goal.title}</h3>
                    <StatusBadge status={goal.status} />
                  </div>
                  {goal.description && (
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{goal.description}</p>
                  )}
                  <div className="max-w-md">
                    <ProgressBar 
                      value={goal.progress} 
                      variant={goal.status === 'completed' ? 'success' : 'primary'} 
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(goal)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(goal)}
                    className="p-2 rounded-lg hover:bg-destructive/20 transition-colors text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingGoal ? 'Edit Goal' : 'Add New Goal'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field w-full"
              placeholder="Enter goal title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field w-full min-h-[100px] resize-none"
              placeholder="Describe your goal"
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
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Target Date (Optional)</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="input-field w-full"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingGoal ? 'Save Changes' : 'Add Goal'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirm
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && deleteGoal(deleteConfirm.id)}
        title={deleteConfirm?.title || ''}
      />
    </div>
  );
}
