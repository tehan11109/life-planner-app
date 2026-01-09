import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom"; // <--- වෙනස් කළා
import { MainLayout } from "@/components/layout/MainLayout";
import { RateUsPrompt } from "@/components/shared/RateUsPrompt";
import { UpgradeModal } from "@/components/subscription/UpgradeModal";
import { PopupAd } from "@/components/ads/PopupAd";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import Targets from "./pages/Targets";
import Education from "./pages/Education";
import Financial from "./pages/Financial";
import Investments from "./pages/Investments";
import Funds from "./pages/Funds";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RateUsPrompt />
      <UpgradeModal />
      <PopupAd />
      {/* Router */}
      <HashRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/targets" element={<Targets />} />
            <Route path="/education" element={<Education />} />
            <Route path="/financial" element={<Financial />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/funds" element={<Funds />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;