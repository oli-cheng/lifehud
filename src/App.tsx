import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/store/AppContext";
import { Navbar } from "@/components/Navbar";
import Index from "./pages/Index";
import Quests from "./pages/Quests";
import QuestDetail from "./pages/QuestDetail";
import Effects from "./pages/Effects";
import Equipment from "./pages/Equipment";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner 
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "hsl(220 20% 12%)",
              border: "1px solid hsl(180 50% 35% / 0.6)",
              color: "hsl(210 20% 90%)",
            },
          }}
        />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/quests" element={<Quests />} />
              <Route path="/quests/:id" element={<QuestDetail />} />
              <Route path="/effects" element={<Effects />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
