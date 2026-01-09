import { useState } from 'react';
import { TrendingUp, Edit2, Trash2, Zap, Clock, CheckCircle } from 'lucide-react';
import { usePlannerData } from '@/hooks/usePlannerData';
import { InvestmentItem } from '@/types/planner';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Modal } from '@/components/shared/Modal';
import { DeleteConfirm } from '@/components/shared/DeleteConfirm';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';

const statusConfig = {
  active: { icon: Zap, label: 'Active', color: 'text-success', bgColor: 'bg-success/20' },
  planned: { icon: Clock, label: 'Planned', color: 'text-warning', bgColor: 'bg-warning/20' },
  sold: { icon: CheckCircle, label: 'Sold', color: 'text-muted-foreground', bgColor: 'bg-muted' },
};

export default function Investments() {
  const { data, addInvestment, updateInvestment, deleteInvestment } = usePlannerData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InvestmentItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<InvestmentItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: 0,
    returnRate: 0,
    status: 'planned' as InvestmentItem['status'],
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', amount: 0, returnRate: 0, status: 'planned' });
    setEditingItem(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: InvestmentItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      amount: item.amount,
      returnRate: item.returnRate,
      status: item.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingItem) {
      updateInvestment(editingItem.id, formData);
    } else {
      addInvestment(formData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const totalInvested = data.investments.filter(i => i.status === 'active').reduce((sum, i) => sum + i.amount, 0);
  const totalPlanned = data.investments.filter(i => i.status === 'planned').reduce((sum, i) => sum + i.amount, 0);
  const avgReturn = data.investments.filter(i => i.status === 'active').length > 0
    ? data.investments.filter(i => i.status === 'active').reduce((sum, i) => sum + i.returnRate, 0) / data.investments.filter(i => i.status === 'active').length
    : 0;

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={TrendingUp}
        title="Investments"
        subtitle="Track your investment portfolio and ideas"
        onAdd={openAddModal}
        addLabel="Add Investment"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Invested</p>
          <p className="text-2xl font-bold currency-display text-foreground">{formatCurrency(totalInvested)}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Planned Investments</p>
          <p className="text-2xl font-bold currency-display text-warning">{formatCurrency(totalPlanned)}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg. Return Rate</p>
          <p className={cn("text-2xl font-bold", avgReturn >= 0 ? 'text-success' : 'text-destructive')}>
            {avgReturn >= 0 ? '+' : ''}{avgReturn.toFixed(1)}%
          </p>
        </div>
      </div>

      {data.investments.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No investments tracked"
          description="Start tracking your investments, stocks, or crypto holdings."
          actionLabel="Add Investment"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.investments.map((item, index) => {
            const config = statusConfig[item.status];
            const Icon = config.icon;

            return (
              <div 
                key={item.id} 
                className="category-card animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1", config.bgColor, config.color)}>
                    <Icon className="w-3 h-3" />
                    {config.label}
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
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                {item.description && (
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-end justify-between pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-lg font-bold currency-display text-foreground">{formatCurrency(item.amount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Return</p>
                    <p className={cn("text-lg font-bold", item.returnRate >= 0 ? 'text-success' : 'text-destructive')}>
                      {item.returnRate >= 0 ? '+' : ''}{item.returnRate}%
                    </p>
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
        title={editingItem ? 'Edit Investment' : 'Add Investment'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Investment Name</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field w-full"
              placeholder="e.g., S&P 500 ETF, Bitcoin"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field w-full min-h-[80px] resize-none"
              placeholder="Investment details or strategy"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
              <input
                type="number"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="input-field w-full"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Return Rate (%)</label>
              <input
                type="number"
                value={formData.returnRate || ''}
                onChange={(e) => setFormData({ ...formData, returnRate: parseFloat(e.target.value) || 0 })}
                className="input-field w-full"
                placeholder="0.0"
                step="0.1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Status</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(statusConfig).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: key as InvestmentItem['status'] })}
                    className={cn(
                      "p-3 rounded-lg border transition-all flex flex-col items-center gap-2",
                      formData.status === key 
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
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingItem ? 'Save Changes' : 'Add Investment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirm
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && deleteInvestment(deleteConfirm.id)}
        title={deleteConfirm?.title || ''}
      />
    </div>
  );
}
