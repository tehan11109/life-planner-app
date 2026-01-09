import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type SubscriptionPlan = "free" | "monthly" | "yearly";

interface SubscriptionState {
  plan: SubscriptionPlan;
  // Convenience flag: any non-free plan is premium
  isPremium: boolean;
}

interface SubscriptionContextValue extends SubscriptionState {
  // UI paywall state
  isPaywallOpen: boolean;
  openPaywall: () => void;
  closePaywall: () => void;
  // Mutations
  subscribe: (plan: Exclude<SubscriptionPlan, "free">) => void;
  cancel: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

const STORAGE_KEY = "planner-subscription";

const defaultState: SubscriptionState = {
  plan: "free",
  isPremium: false,
};

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SubscriptionState>(defaultState);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  // Load from localStorage on first mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as Partial<SubscriptionState> | null;
      if (!parsed || typeof parsed !== "object") return;

      const plan = parsed.plan === "monthly" || parsed.plan === "yearly" ? parsed.plan : "free";
      const isPremium = plan !== "free";

      setState({ plan, isPremium });
    } catch {
      // Ignore invalid data and keep defaults
      setState(defaultState);
    }
  }, []);

  // Persist changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ plan: state.plan, isPremium: state.isPremium })
      );
    } catch {
      // Ignore storage errors
    }
  }, [state]);

  const subscribe = (plan: Exclude<SubscriptionPlan, "free">) => {
    setState({ plan, isPremium: true });
    setIsPaywallOpen(false);
  };

  const cancel = () => {
    setState(defaultState);
  };

  const openPaywall = () => setIsPaywallOpen(true);
  const closePaywall = () => setIsPaywallOpen(false);

  const value: SubscriptionContextValue = {
    ...state,
    isPaywallOpen,
    openPaywall,
    closePaywall,
    subscribe,
    cancel,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return ctx;
}
