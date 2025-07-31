import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Generator from "@/pages/generator";
import Dashboard from "@/pages/dashboard";
import Subscribe from "@/pages/subscribe";
import DocumentView from "@/pages/document-view";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/document/:shareToken" component={DocumentView} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/generate" component={Generator} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/subscribe" component={Subscribe} />
          <Route path="/document/:shareToken" component={DocumentView} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
