import { Modal } from "@/components/shared/Modal";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/components/ui/sonner";

export function UpgradeModal() {
  const { isPaywallOpen, closePaywall, subscribe } = useSubscription();

  if (!isPaywallOpen) return null;

  const handleSubscribeMonthly = () => {
    // NOTE: This currently just unlocks premium in local storage.
    // In a real app, call this after your payment succeeds.
    subscribe("monthly");
    toast("Congratulations! You are now Premium (Monthly).", {
      description: "Ads removed and target limit unlocked.",
    });
  };

  const handleSubscribeYearly = () => {
    // NOTE: This currently just unlocks premium in local storage.
    // In a real app, call this after your payment succeeds.
    subscribe("yearly");
    toast("Congratulations! You are now Premium (Yearly).", {
      description: "Thank you for supporting the app!",
    });
  };

  return (
    <Modal
      isOpen={isPaywallOpen}
      onClose={closePaywall}
      title="Upgrade to Premium"
      size="md"
    >
      <div className="space-y-4 text-sm">
        <p className="text-muted-foreground">
          Unlock the full power of Life Planner with Premium:
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Unlimited targets (free version is limited to 6)</li>
          <li>Remove all ads from the app</li>
        </ul>

        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          <button
            type="button"
            onClick={handleSubscribeMonthly}
            className="border border-border rounded-xl p-4 text-left hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
              Monthly
            </p>
            <p className="text-2xl font-bold text-foreground mb-1">$0.99</p>
            <p className="text-xs text-muted-foreground">per month, cancel anytime</p>
          </button>

          <button
            type="button"
            onClick={handleSubscribeYearly}
            className="border border-primary rounded-xl p-4 text-left bg-primary/5 hover:bg-primary/10 transition-colors relative"
          >
            <span className="absolute -top-2 right-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
              Best value
            </span>
            <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
              Yearly
            </p>
            <p className="text-2xl font-bold text-foreground mb-1">$9.00</p>
            <p className="text-xs text-muted-foreground">one-time per year</p>
          </button>
        </div>

        <p className="text-[11px] text-muted-foreground/80 pt-2">
          These prices are for display in the UI. Make sure they match the prices
          you configure in the Play Store, App Store, or your payment provider.
        </p>
      </div>
    </Modal>
  );
}
