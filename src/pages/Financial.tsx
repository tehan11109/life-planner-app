import { useState } from 'react';
import { Wallet, Edit2, Trash2, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { usePlannerData } from '@/hooks/usePlannerData';
import { FinancialItem } from '@/types/planner';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Modal } from '@/components/shared/Modal';
import { DeleteConfirm } from '@/components/shared/DeleteConfirm';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';

const typeConfig = {
  income: { icon: TrendingUp, label: 'Income', color: 'text-success', bgColor: 'bg-success/20' },
  expense: { icon: TrendingDown, label: 'Expense', color: 'text-destructive', bgColor: 'bg-destructive/20' },
  saving: { icon: PiggyBank, label: 'Saving', color: 'text-primary', bgColor: 'bg-primary/20' },
};

export default function Financial() {
  const { data, addFinancial, updateFinancial, deleteFinancial } = usePlannerData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FinancialItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<FinancialItem | null>(null);
  const [filter, setFilter] = useState<'all' | FinancialItem['type']>('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: 0,
    type: 'income' as FinancialItem['type'],
    category: '',
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', amount: 0, type: 'income', category: '' });
    setEditingItem(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (item: FinancialItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      amount: item.amount,
      type: item.type,
      category: item.category,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingItem) {
      updateFinancial(editingItem.id, formData);
    } else {
      addFinancial(formData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const filteredData = filter === 'all' 
    ? data.financial 
    : data.financial.filter(item => item.type === filter);

  const totalIncome = data.financial.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
  const totalExpenses = data.financial.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
  const totalSavings = data.financial.filter(f => f.type === 'saving').reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        icon={Wallet}
        title="Financial"
        subtitle="Track your income, expenses, and savings"
        onAdd={openAddModal}
        addLabel="Add Entry"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-xl font-bold currency-display text-success">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-xl font-bold currency-display text-destructive">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Savings</p>
              <p className="text-xl font-bold currency-display text-primary">{formatCurrency(totalSavings)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['all', 'income', 'expense', 'saving'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              filter === type 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {type === 'all' ? 'All' : typeConfig[type].label}
          </button>
        ))}
      </div>

      {filteredData.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title={filter === 'all' ? "No financial entries yet" : `No ${filter} entries`}
          description="Start tracking your finances by adding income, expenses, or savings."
          actionLabel="Add Entry"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid gap-3">
          {filteredData.map((item, index) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;

            return (
              <div 
                key={item.id} 
                className="category-card animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", config.bgColor)}>
                      <Icon className={cn("w-5 h-5", config.color)} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {item.category && <span>{item.category}</span>}
                        {item.category && <span>•</span>}
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn("text-lg font-bold currency-display", config.color)}>
                      {item.type === 'expense' ? '-' : '+'}{formatCurrency(item.amount)}
                    </span>
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
        title={editingItem ? 'Edit Entry' : 'Add Financial Entry'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Type</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(typeConfig).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: key as FinancialItem['type'] })}
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
              placeholder="e.g., Salary, Rent, Groceries"
              required
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
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field w-full"
                placeholder="e.g., Work, Bills"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field w-full min-h-[80px] resize-none"
              placeholder="Add notes"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingItem ? 'Save Changes' : 'Add Entry'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirm
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && deleteFinancial(deleteConfirm.id)}
        title={deleteConfirm?.title || ''}
      />
    </div>
  );
}
