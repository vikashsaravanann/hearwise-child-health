import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/contexts/SessionContext";
import OfflineBadge from "@/components/OfflineBadge";
import LandingPage from "./pages/LandingPage";
import SessionSetupPage from "./pages/SessionSetupPage";
import StudentEntryPage from "./pages/StudentEntryPage";
import HeadphoneCheckPage from "./pages/HeadphoneCheckPage";
import PracticeRoundPage from "./pages/PracticeRoundPage";
import ActiveTestPage from "./pages/ActiveTestPage";
import ResultsPage from "./pages/ResultsPage";
import SessionSummaryPage from "./pages/SessionSummaryPage";
import DashboardPage from "./pages/DashboardPage";
import LearningHubPage from "./pages/LearningHubPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SessionProvider>
        <Toaster />
        <Sonner />
        <OfflineBadge />
        <HashRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/setup" element={<SessionSetupPage />} />
            <Route path="/student-entry" element={<StudentEntryPage />} />
            <Route path="/headphone-check" element={<HeadphoneCheckPage />} />
            <Route path="/practice" element={<PracticeRoundPage />} />
            <Route path="/test" element={<ActiveTestPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/session-summary" element={<SessionSummaryPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/learning-hub" element={<LearningHubPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </SessionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
