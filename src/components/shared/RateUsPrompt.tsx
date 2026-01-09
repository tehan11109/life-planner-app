import { useEffect, useState } from 'react';
import { Modal } from '@/components/shared/Modal';

const NEVER_KEY = 'planner-rate-never';
const SNOOZE_KEY = 'planner-rate-snooze-usage-until';
const USAGE_KEY = 'planner-rate-usage-ms';
const DELAY_MS = 5 * 60 * 1000; // 5 minutes of total use time
const TICK_MS = 5 * 1000; // update every 5s

export function RateUsPrompt() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If user opted out, never show again
    if (window.localStorage.getItem(NEVER_KEY) === 'true') {
      return;
    }

    let usage = 0;
    const storedUsage = window.localStorage.getItem(USAGE_KEY);
    if (storedUsage) {
      const parsed = Number(storedUsage);
      if (!Number.isNaN(parsed) && parsed >= 0) {
        usage = parsed;
      }
    }

    const storedSnooze = window.localStorage.getItem(SNOOZE_KEY);
    let snoozeUntilUsage: number | null = null;
    if (storedSnooze) {
      const parsed = Number(storedSnooze);
      if (!Number.isNaN(parsed) && parsed >= 0) {
        snoozeUntilUsage = parsed;
      }
    }

    const interval = window.setInterval(() => {
      // Stop if user opted out while running
      if (window.localStorage.getItem(NEVER_KEY) === 'true') {
        window.clearInterval(interval);
        return;
      }

      usage += TICK_MS;
      try {
        window.localStorage.setItem(USAGE_KEY, String(usage));
      } catch {
        // ignore
      }

      if (usage < DELAY_MS) return;
      if (snoozeUntilUsage !== null && usage < snoozeUntilUsage) return;

      // Show prompt once when criteria met
      setIsOpen(true);
      window.clearInterval(interval);
    }, TICK_MS);

    return () => window.clearInterval(interval);
  }, []);

  const handleClose = () => {
    // Treat closing via X or backdrop as "later"
    handleLater();
  };

  const handleSure = () => {
    // TODO: replace with your real store link(s)
    const url = 'https://play.google.com/store';
    window.open(url, '_blank');

    window.localStorage.setItem(NEVER_KEY, 'true');
    window.localStorage.removeItem(SNOOZE_KEY);
    setIsOpen(false);
  };

  const handleLater = () => {
    try {
      const usageRaw = window.localStorage.getItem(USAGE_KEY);
      const currentUsage = usageRaw ? Number(usageRaw) || 0 : 0;
      const snoozeUntil = currentUsage + DELAY_MS;
      window.localStorage.setItem(SNOOZE_KEY, String(snoozeUntil));
    } catch {
      // ignore
    }
    setIsOpen(false);
  };

  const handleNever = () => {
    try {
      window.localStorage.setItem(NEVER_KEY, 'true');
      window.localStorage.removeItem(SNOOZE_KEY);
    } catch {
      // ignore
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Enjoying Life Planner?" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          If you&apos;re finding this planner helpful, would you mind taking a moment to rate us on the
          Play Store or App Store? Your feedback helps us improve.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={handleNever}
            className="btn-ghost w-full sm:w-auto text-xs sm:text-sm"
          >
            Don&apos;t send me this again
          </button>
          <button
            type="button"
            onClick={handleLater}
            className="btn-secondary w-full sm:w-auto text-sm"
          >
            Mmmm, later
          </button>
          <button
            type="button"
            onClick={handleSure}
            className="btn-primary w-full sm:w-auto text-sm"
          >
            Sure
          </button>
        </div>
      </div>
    </Modal>
  );
}
