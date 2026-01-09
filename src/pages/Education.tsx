import { useState } from 'react';
import { GraduationCap, Edit2, Trash2, BookOpen, Award, Lightbulb, FileText } from 'lucide-react';
import { usePlannerData } from '@/hooks/usePlannerData';
import { EducationItem, Status } from '@/types/planner';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { EmptyState } from '@/components/shared/EmptyState';
import { Modal } from '@/components/shared/Modal';
import { DeleteConfirm } from '@/components/shared/DeleteConfirm';
import { cn } from '@/lib/utils';

const typeConfig = {
  course: { icon: GraduationCap, label: 'Course', color: 'text-primary' },
  book: { icon: BookOpen, label: 'Book', color: 'text-accent' },
  skill: { icon: Lightbulb, label: 'Skill', color: 'text-warning' },
  certification: { icon: Award, label: 'Certification', color: 'text-success' },
};

export default function Education() {
  const { data, addEducation, updateEducation, deleteEducation } = usePlannerData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<EducationItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'course' as EducationItem['type'],
    status: 'pending' as Status,
    progress: 0,
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', type: 'course', status: 'pending', progress: 0 });
    setEditingItem(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: EducationItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      type: item.type,
      status: item.status,
      progress: item.progress,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingItem) {
      updateEducation(editingItem.id, formData);
    } else {
      addEducation(formData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={GraduationCap}
        title="Education"
        subtitle="Track courses, skills, books, and certifications"
        onAdd={openAddModal}
        addLabel="Add Item"
      />

      {data.education.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="Start your learning journey"
          description="Add courses, books, skills, or certifications you want to complete this year."
          actionLabel="Add First Item"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.education.map((item, index) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;

            return (
              <div 
                key={item.id} 
                className="category-card animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("w-10 h-10 rounded-lg bg-muted flex items-center justify-center", config.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(item)}
                      className="p-2 rounded-lg hover:bg-destructive/20 transition-colors text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("text-xs font-medium px-2 py-1 rounded-md bg-muted", config.color)}>
                    {config.label}
                  </span>
                  <StatusBadge status={item.status} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{item.title}</h3>
                {item.description && (
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
                )}
                <ProgressBar 
                  value={item.progress} 
                  variant={item.status === 'completed' ? 'success' : 'primary'} 
                />
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
        title={editingItem ? 'Edit Item' : 'Add Education Item'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Type</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(typeConfig).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: key as EducationItem['type'] })}
                    className={cn(
                      "p-3 rounded-lg border transition-all flex flex-col items-center gap-2",
                      formData.type === key 
                        ? "border-primary bg-primary/10 text-primary" 
                        : "border-border bg-muted/50 text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field w-full"
              placeholder="Enter title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field w-full min-h-[80px] resize-none"
              placeholder="Add notes or details"
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
              {editingItem ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirm
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && deleteEducation(deleteConfirm.id)}
        title={deleteConfirm?.title || ''}
      />
    </div>
  );
}
