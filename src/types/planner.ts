export type Status = 'pending' | 'in-progress' | 'completed';

export interface Goal {
  id: string;
  title: string;
  description: string;
  status: Status;
  progress: number;
  createdAt: string;
  dueDate?: string;
}

export interface Target {
  id: string;
  title: string;
  description: string;
  status: Status;
  progress: number;
  deadline: string;
  createdAt: string;
}

export interface EducationItem {
  id: string;
  title: string;
  type: 'course' | 'book' | 'skill' | 'certification';
  description: string;
  status: Status;
  progress: number;
  createdAt: string;
}

export interface FinancialItem {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'saving';
  category: string;
  createdAt: string;
}

export interface InvestmentItem {
  id: string;
  title: string;
  description: string;
  amount: number;
  returnRate: number;
  status: 'active' | 'planned' | 'sold';
  createdAt: string;
}

export interface Fund {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
}

export interface PlannerData {
  goals: Goal[];
  targets: Target[];
  education: EducationItem[];
  financial: FinancialItem[];
  investments: InvestmentItem[];
  funds: Fund[];
}
