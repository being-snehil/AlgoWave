import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Algorithm from "./pages/Algorithm";
import BankersAlgorithm from "./pages/BankersAlgorithm";
import GraphAlgorithms from "./pages/GraphAlgorithms";
import PathfindingAlgorithms from "./pages/PathfindingAlgorithms";
import SortingAlgorithms from "./pages/SortingAlgorithms";
import NotFound from "./pages/NotFound";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="dark">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/algorithm/:algorithmId" element={<Algorithm />} />
            <Route path="/bankers" element={<BankersAlgorithm />} />
            <Route path="/graph" element={<GraphAlgorithms />} />
            <Route path="/pathfinding" element={<PathfindingAlgorithms />} />
            <Route path="/sorting" element={<SortingAlgorithms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;