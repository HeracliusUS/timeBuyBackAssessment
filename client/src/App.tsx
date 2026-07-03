import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AssessmentProvider } from "./contexts/AssessmentContext";
import Home from "./pages/Home";
import { useEffect } from "react";
import { trackPageLanded, initClarity, getStoredConsent, initClickTracking } from "./lib/analytics";
import ConsentBanner from "./components/ConsentBanner";


const base = "/TimeBuyBackAssessment";

function Router() {
  return (
    <WouterRouter base={base}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  useEffect(() => {
    trackPageLanded();
    // US-default granted: load Clarity unless the visitor previously opted out.
    if (getStoredConsent() !== "denied") initClarity();
    // Catch-all: fire element_click for every button/link (returns cleanup).
    return initClickTracking();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AssessmentProvider>
            <Toaster />
            <Router />
            <ConsentBanner />
          </AssessmentProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;