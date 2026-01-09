import { useState, useEffect, useCallback } from 'react';
import { PlannerData, Goal, Target, EducationItem, FinancialItem, InvestmentItem, Fund } from '@/types/planner';

const STORAGE_KEY = 'yearly-planner-data';

const defaultData: PlannerData = {
  goals: [],
  targets: [],
  education: [],
  financial: [],
  investments: [],
  funds: [],
};

export function usePlannerData() {
  const [data, setData] = useState<PlannerData>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        setData(defaultData);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const generateId = () => crypto.randomUUID();

  // Goals
  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = { ...goal, id: generateId(), createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, ...updates } : g)
    }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setData(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
  }, []);

  // Targets
  const addTarget = useCallback((target: Omit<Target, 'id' | 'createdAt'>) => {
    const newTarget: Target = { ...target, id: generateId(), createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, targets: [...prev.targets, newTarget] }));
  }, []);

  const updateTarget = useCallback((id: string, updates: Partial<Target>) => {
    setData(prev => ({
      ...prev,
      targets: prev.targets.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  }, []);

  const deleteTarget = useCallback((id: string) => {
    setData(prev => ({ ...prev, targets: prev.targets.filter(t => t.id !== id) }));
  }, []);

  // Education
  const addEducation = useCallback((item: Omit<EducationItem, 'id' | 'createdAt'>) => {
    const newItem: EducationItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, education: [...prev.education, newItem] }));
  }, []);

  const updateEducation = useCallback((id: string, updates: Partial<EducationItem>) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  }, []);

  const deleteEducation = useCallback((id: string) => {
    setData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  }, []);

  // Financial
  const addFinancial = useCallback((item: Omit<FinancialItem, 'id' | 'createdAt'>) => {
    const newItem: FinancialItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, financial: [...prev.financial, newItem] }));
  }, []);

  const updateFinancial = useCallback((id: string, updates: Partial<FinancialItem>) => {
    setData(prev => ({
      ...prev,
      financial: prev.financial.map(f => f.id === id ? { ...f, ...updates } : f)
    }));
  }, []);

  const deleteFinancial = useCallback((id: string) => {
    setData(prev => ({ ...prev, financial: prev.financial.filter(f => f.id !== id) }));
  }, []);

  // Investments
  const addInvestment = useCallback((item: Omit<InvestmentItem, 'id' | 'createdAt'>) => {
    const newItem: InvestmentItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, investments: [...prev.investments, newItem] }));
  }, []);

  const updateInvestment = useCallback((id: string, updates: Partial<InvestmentItem>) => {
    setData(prev => ({
      ...prev,
      investments: prev.investments.map(i => i.id === id ? { ...i, ...updates } : i)
    }));
  }, []);

  const deleteInvestment = useCallback((id: string) => {
    setData(prev => ({ ...prev, investments: prev.investments.filter(i => i.id !== id) }));
  }, []);

  // Funds
  const addFund = useCallback((fund: Omit<Fund, 'id' | 'createdAt'>) => {
    const newFund: Fund = { ...fund, id: generateId(), createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, funds: [...prev.funds, newFund] }));
  }, []);

  const updateFund = useCallback((id: string, updates: Partial<Fund>) => {
    setData(prev => ({
      ...prev,
      funds: prev.funds.map(f => f.id === id ? { ...f, ...updates } : f)
    }));
  }, []);

  const deleteFund = useCallback((id: string) => {
    setData(prev => ({ ...prev, funds: prev.funds.filter(f => f.id !== id) }));
  }, []);

  return {
    data,
    isLoaded,
    addGoal, updateGoal, deleteGoal,
    addTarget, updateTarget, deleteTarget,
    addEducation, updateEducation, deleteEducation,
    addFinancial, updateFinancial, deleteFinancial,
    addInvestment, updateInvestment, deleteInvestment,
    addFund, updateFund, deleteFund,
  };
}
