import { useState } from 'react';
import { PiggyBank, Edit2, Trash2, Plus, Minus } from 'lucide-react';
import { usePlannerData } from '@/hooks/usePlannerData';
import { Fund } from '@/types/planner';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { EmptyState } from '@/components/shared/EmptyState';
import { Modal } from '@/components/shared/Modal';
import { DeleteConfirm } from '@/components/shared/DeleteConfirm';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';

export default function Funds() {
  const { data, addFund, updateFund, deleteFund } = usePlannerData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFund, setEditingFund] = useState<Fund | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Fund | null>(null);
  const [quickAddModal, setQuickAddModal] = useState<Fund | null>(null);
  const [quickAddAmount, setQuickAddAmount] = useState(0);
  const [quickAddType, setQuickAddType] = useState<'add' | 'subtract'>('add');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: 0,
    currentAmount: 0,
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', targetAmount: 0, currentAmount: 0 });
    setEditingFund(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (fund: Fund) => {
    setEditingFund(fund);
    setFormData({
      name: fund.name,
      description: fund.description,
      targetAmount: fund.targetAmount,
      currentAmount: fund.currentAmount,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingFund) {
      updateFund(editingFund.id, formData);
    } else {
      addFund(formData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleQuickAdd = () => {
    if (!quickAddModal || quickAddAmount <= 0) return;
    const newAmount = quickAddType === 'add' 
      ? quickAddModal.currentAmount + quickAddAmount
      : Math.max(0, quickAddModal.currentAmount - quickAddAmount);
    updateFund(quickAddModal.id, { currentAmount: newAmount });
    setQuickAddModal(null);
    setQuickAddAmount(0);
  };

  const totalTarget = data.funds.reduce((sum, f) => sum + f.targetAmount, 0);
  const totalCurrent = data.funds.reduce((sum, f) => sum + f.currentAmount, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={PiggyBank}
        title="Funds"
        subtitle="Manage your saving funds and goals"
        onAdd={openAddModal}
        addLabel="Create Fund"
      />

      {/* Overall Progress */}
      {data.funds.length > 0 && (
        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Saved</p>
              <p className="text-3xl font-bold currency-display text-foreground">
                {formatCurrency(totalCurrent)}
                <span className="text-lg text-muted-foreground font-normal"> / {formatCurrency(totalTarget)}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold gradient-text">{overallProgress}%</p>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
            </div>
          </div>
          <ProgressBar value={overallProgress} variant="success" showLabel={false} />
        </div>
      )}

      {data.funds.length === 0 ? (
        <EmptyState
          icon={PiggyBank}
          title="No funds created"
          description="Create saving funds for specific goals like Emergency Fund, Travel Fund, or Home Down Payment."
          actionLabel="Create First Fund"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.funds.map((fund, index) => {
            const progress = fund.targetAmount > 0 
              ? Math.round((fund.currentAmount / fund.targetAmount) * 100) 
              : 0;
            const isComplete = progress >= 100;

            return (
              <div 
                key={fund.id} 
                className={cn(
                  "category-card animate-slide-up",
                  isComplete && "border-success/50"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    isComplete ? "bg-success/20" : "bg-primary/20"
                  )}>
                    <PiggyBank className={cn("w-6 h-6", isComplete ? "text-success" : "text-primary")} />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setQuickAddModal(fund);
                        setQuickAddType('add');
                        setQuickAddAmount(0);
                      }}
                      className="p-2 rounded-lg hover:bg-success/20 transition-colors text-muted-foreground hover:text-success"
                      title="Add funds"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setQuickAddModal(fund);
                        setQuickAddType('subtract');
                        setQuickAddAmount(0);
                      }}
                      className="p-2 rounded-lg hover:bg-warning/20 transition-colors text-muted-foreground hover:text-warning"
                      title="Withdraw funds"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(fund)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(fund)}
                      className="p-2 rounded-lg hover:bg-destructive/20 transition-colors text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{fund.name}</h3>
                {fund.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{fund.description}</p>
                )}
                <div className="mb-3">
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-2xl font-bold currency-display text-foreground">
                      {formatCurrency(fund.currentAmount)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      of {formatCurrency(fund.targetAmount)}
                    </span>
                  </div>
                  <ProgressBar 
                    value={progress} 
                    variant={isComplete ? 'success' : 'primary'} 
                  />
                </div>
                {isComplete && (
                  <div className="text-center py-2 bg-success/10 rounded-lg">
                    <span className="text-success text-sm font-medium">🎉 Goal Achieved!</span>
                  </div>
                )}
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
        title={editingFund ? 'Edit Fund' : 'Create Saving Fund'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Fund Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field w-full"
              placeholder="e.g., Emergency Fund, Travel Fund"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field w-full min-h-[80px] resize-none"
              placeholder="What is this fund for?"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Target Amount</label>
              <input
                type="number"
                value={formData.targetAmount || ''}
                onChange={(e) => setFormData({ ...formData, targetAmount: parseFloat(e.target.value) || 0 })}
                className="input-field w-full"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Current Amount</label>
              <input
                type="number"
                value={formData.currentAmount || ''}
                onChange={(e) => setFormData({ ...formData, currentAmount: parseFloat(e.target.value) || 0 })}
                className="input-field w-full"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingFund ? 'Save Changes' : 'Create Fund'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Quick Add/Subtract Modal */}
      <Modal
        isOpen={!!quickAddModal}
        onClose={() => {
          setQuickAddModal(null);
          setQuickAddAmount(0);
        }}
        title={quickAddType === 'add' ? 'Add to Fund' : 'Withdraw from Fund'}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {quickAddType === 'add' ? 'Add money to' : 'Withdraw money from'} <span className="font-semibold text-foreground">{quickAddModal?.name}</span>
          </p>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
            <input
              type="number"
              value={quickAddAmount || ''}
              onChange={(e) => setQuickAddAmount(parseFloat(e.target.value) || 0)}
              className="input-field w-full"
              placeholder="0.00"
              min="0"
              step="0.01"
              autoFocus
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => setQuickAddModal(null)} 
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button 
              onClick={handleQuickAdd} 
              className={cn(
                "flex-1 px-6 py-3 rounded-lg font-medium transition-all",
                quickAddType === 'add' 
                  ? "bg-success text-white hover:opacity-90" 
                  : "bg-warning text-white hover:opacity-90"
              )}
            >
              {quickAddType === 'add' ? 'Add Funds' : 'Withdraw'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirm
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && deleteFund(deleteConfirm.id)}
        title={deleteConfirm?.name || ''}
      />
    </div>
  );
}
