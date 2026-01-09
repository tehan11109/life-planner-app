import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./hooks/useTheme";
import { SubscriptionProvider } from "./hooks/useSubscription";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <SubscriptionProvider>
      <App />
    </SubscriptionProvider>
  </ThemeProvider>
);
