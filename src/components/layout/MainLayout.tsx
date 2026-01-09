import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { cn } from '@/lib/utils';
import { BannerAd } from '@/components/ads/BannerAd';

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile top navigation */}
      <MobileNav />

      {/* Desktop sidebar navigation */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main 
        className={cn(
          "min-h-screen transition-all duration-300 pt-16 px-4 pb-6 sm:px-6 lg:px-8 lg:pt-8",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
          <BannerAd />
        </div>
      </main>
    </div>
  );
}
