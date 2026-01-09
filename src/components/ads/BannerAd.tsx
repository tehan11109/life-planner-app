import { useSubscription } from "@/hooks/useSubscription";

export function BannerAd() {
  const { isPremium } = useSubscription();

  if (isPremium) return null;

  return (
    <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/40 p-4 text-center text-xs text-muted-foreground">
      <p className="font-medium mb-1">Ad space</p>
      <p>
        This is a placeholder banner. Connect this area to your ad network (e.g. AdMob, AdSense)
        when you are ready.
      </p>
    </div>
  );
}
