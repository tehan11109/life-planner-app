import { useEffect, useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { useSubscription } from "@/hooks/useSubscription";

const POPUP_INTERVAL_MS = 2 * 60 * 1000; // every 2 minutes
const POPUP_DURATION_MS = 15 * 1000; // show for 15 seconds

export function PopupAd() {
  const { isPremium } = useSubscription();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Premium users never see popups
    if (isPremium) {
      setIsOpen(false);
      return;
    }

    let intervalId: number | undefined;
    let timeoutId: number | undefined;

    const showPopup = () => {
      setIsOpen(true);
      // Auto-close after POPUP_DURATION_MS
      timeoutId = window.setTimeout(() => {
        setIsOpen(false);
      }, POPUP_DURATION_MS);
    };

    // Start showing after the first 2 minutes, then every 2 minutes
    intervalId = window.setInterval(showPopup, POPUP_INTERVAL_MS);

    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isPremium]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (isPremium || !isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Sponsored Video" size="sm">
      <div className="space-y-4 text-sm text-muted-foreground text-center">
        <div className="w-full aspect-video rounded-xl bg-black/80 flex items-center justify-center text-xs text-muted-foreground">
          15s video ad placeholder
        </div>
        <p>
          Replace this area with your real 15-second video ad (e.g. AdMob interstitial / rewarded).
        </p>
        <p className="text-[11px] text-muted-foreground/80">
          The video will automatically finish after 15 seconds. Upgrade to Premium to remove ads.
        </p>
      </div>
    </Modal>
  );
}
