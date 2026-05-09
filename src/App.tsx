import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/contexts/SessionContext";
import OfflineBadge from "@/components/OfflineBadge";
import { SpeedInsights } from "@vercel/speed-insights/react";
import LandingPage from "./pages/LandingPage";
import SessionSetupPage from "./pages/SessionSetupPage";
import StudentEntryPage from "./pages/StudentEntryPage";
import HeadphoneCheckPage from "./pages/HeadphoneCheckPage";
import OceanLevelSelectPage from "./pages/OceanLevelSelectPage";
import OceanTestPage from "./pages/OceanTestPage";
import LevelResultPage from "./pages/LevelResultPage";
import SessionSummaryPage from "./pages/SessionSummaryPage";
import AnimatedDashboardPage from "./pages/AnimatedDashboardPage";
import GamesPage from "./pages/Games";
import TrophiesPage from "./pages/Trophies";
import EarCarePage from "./pages/EarCare";
import EducationPage from "./pages/Education";
import LearnPage from "./pages/Learn";
import SoundExplorerPage from "./pages/SoundExplorer";
import MyReportPage from "./pages/MyReport";
import HeadphoneSafetyPage from "./pages/HeadphoneSafety";
import NoiseAwarenessPage from "./pages/NoiseAwareness";
import SelfCheckPage from "./pages/SelfCheck";
import BookAppointmentPage from "./pages/BookAppointment";
import LeaderboardPage from "./pages/Leaderboard";
import HelpPage from "./pages/Help";
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
        <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/setup" element={<SessionSetupPage />} />
            <Route path="/student-entry" element={<StudentEntryPage />} />
            <Route path="/headphone-check" element={<HeadphoneCheckPage />} />
            <Route path="/ocean-levels" element={<OceanLevelSelectPage />} />
            <Route path="/ocean-test/:level" element={<OceanTestPage />} />
            <Route path="/level-result/:level" element={<LevelResultPage />} />
            <Route path="/session-summary" element={<SessionSummaryPage />} />
            <Route path="/dashboard" element={<AnimatedDashboardPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/trophies" element={<TrophiesPage />} />
            <Route path="/ear-care" element={<EarCarePage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/sound-explorer" element={<SoundExplorerPage />} />
            <Route path="/my-report" element={<MyReportPage />} />
            <Route path="/headphone-safety" element={<HeadphoneSafetyPage />} />
            <Route path="/noise-awareness" element={<NoiseAwarenessPage />} />
            <Route path="/self-check" element={<SelfCheckPage />} />
            <Route path="/book-appointment" element={<BookAppointmentPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <SpeedInsights />
      </SessionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
