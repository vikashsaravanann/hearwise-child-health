import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/contexts/SessionContext";
import OfflineBadge from "@/components/OfflineBadge";
import AdminGuard from "@/components/AdminGuard";
import LandingPage from "./pages/LandingPage";
import SessionSetupPage from "./pages/SessionSetupPage";
import StudentEntryPage from "./pages/StudentEntryPage";
import HeadphoneCheckPage from "./pages/HeadphoneCheckPage";
import PracticeRoundPage from "./pages/PracticeRoundPage";
import ActiveTestPage from "./pages/ActiveTestPage";
import ResultsPage from "./pages/ResultsPage";
import SessionSummaryPage from "./pages/SessionSummaryPage";
import DashboardPage from "./pages/DashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SessionProvider>
        <Toaster />
        <Sonner />
        <OfflineBadge />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/setup" element={<SessionSetupPage />} />
            <Route path="/student-entry" element={<StudentEntryPage />} />
            <Route path="/headphone-check" element={<HeadphoneCheckPage />} />
            <Route path="/practice" element={<PracticeRoundPage />} />
            <Route path="/test" element={<ActiveTestPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/session-summary" element={<SessionSummaryPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route
              path="/dashboard"
              element={
                <AdminGuard>
                  <DashboardPage />
                </AdminGuard>
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
