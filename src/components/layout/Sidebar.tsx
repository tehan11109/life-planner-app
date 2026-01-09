import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Flag, 
  GraduationCap, 
  Wallet, 
  TrendingUp, 
  PiggyBank,
  ChevronLeft,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { useSubscription } from '@/hooks/useSubscription';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/goals', icon: Flag, label: 'Yearly Goals' },
  { to: '/targets', icon: Target, label: 'Targets' },
  { to: '/education', icon: GraduationCap, label: 'Education' },
  { to: '/financial', icon: Wallet, label: 'Financial' },
  { to: '/investments', icon: TrendingUp, label: 'Investments' },
  { to: '/funds', icon: PiggyBank, label: 'Funds' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const currentYear = new Date().getFullYear();
  const { isPremium, openPaywall } = useSubscription();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40 hidden lg:flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && "justify-center")}>
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <h1 className="font-semibold text-foreground text-sm">Life Planner</h1>
                <p className="text-xs text-muted-foreground">{currentYear}</p>
              </div>
            )}
          </div>
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "nav-item",
                isActive && "nav-item-active",
                collapsed && "justify-center px-3"
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="animate-fade-in truncate">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Subscription + Toggle */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        {!isPremium && (
          <button
            onClick={openPaywall}
            className={cn(
              "w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors",
              collapsed && "justify-center px-3 text-xs"
            )}
          >
            <span>Go Premium</span>
          </button>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-all",
            collapsed && "justify-center px-3"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
