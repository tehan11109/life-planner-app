import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Calendar, Menu, X, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { navItems } from './Sidebar';
import { useSubscription } from '@/hooks/useSubscription';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const { isPremium, openPaywall } = useSubscription();

  // Close the menu when the route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-sidebar border-b border-sidebar-border lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-sm text-foreground">Life Planner</h1>
            <p className="text-xs text-muted-foreground">{currentYear}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isPremium && (
            <button
              type="button"
              onClick={openPaywall}
              className="inline-flex items-center rounded-full border border-primary/70 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary/20"
            >
              <Crown className="w-3 h-3 mr-1" />
              Go Premium
            </button>
          )}
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-sidebar-border bg-sidebar animate-slide-up">
          <div className="flex flex-col p-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'nav-item w-full',
                    isActive && 'nav-item-active'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="truncate text-sm">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
