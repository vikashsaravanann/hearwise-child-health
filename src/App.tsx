import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, Link } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/contexts/SessionContext";
import OfflineBadge from "@/components/OfflineBadge";
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
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminLayout from "./components/AdminLayout";
import AdminGuard from "./components/AdminGuard";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminSchoolsPage from "./pages/admin/AdminSchoolsPage";
import AdminTeachersPage from "./pages/admin/AdminTeachersPage";
import AdminStudentsPage from "./pages/admin/AdminStudentsPage";
import AdminSessionsPage from "./pages/admin/AdminSessionsPage";
import AdminReferralsPage from "./pages/admin/AdminReferralsPage";
import AdminLoginsPage from "./pages/admin/AdminLoginsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminExportPage from "./pages/admin/AdminExportPage";
import AboutDeveloperPage from "./pages/admin/AboutDeveloperPage";
import PracticeRoundPage from "./pages/PracticeRoundPage";
import ActiveTestPage from "./pages/ActiveTestPage";
import ResultsPage from "./pages/ResultsPage";
import ExplorePage from "./pages/ExplorePage";

const queryClient = new QueryClient();

function ExploreFloatingButton() {
  const loc = useLocation();
  if (loc.pathname === "/explore") return null;
  return (
    <Link to="/explore" style={{
      position: "fixed", bottom: 20, right: 20, zIndex: 9999,
      background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
      color: "#fff", borderRadius: "50px", padding: "10px 18px",
      fontWeight: 700, fontSize: 13, boxShadow: "0 4px 20px rgba(6,182,212,.4)",
      display: "flex", alignItems: "center", gap: 6, textDecoration: "none"
    }}>
      🧭 Explore
    </Link>
  );
}

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
            <Route path="/explore" element={<ExplorePage />} />

            <Route path="/practice" element={<PracticeRoundPage />} />
            <Route path="/active-test" element={<ActiveTestPage />} />
            <Route path="/results" element={<ResultsPage />} />

            {/* Admin: standalone login page */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin: protected nested routes rendered inside AdminLayout */}
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }
            >
              <Route index element={<AdminOverviewPage />} />
              <Route path="dashboard" element={<AdminOverviewPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="schools" element={<AdminSchoolsPage />} />
              <Route path="teachers" element={<AdminTeachersPage />} />
              <Route path="students" element={<AdminStudentsPage />} />
              <Route path="sessions" element={<AdminSessionsPage />} />
              <Route path="referrals" element={<AdminReferralsPage />} />
              <Route path="logins" element={<AdminLoginsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="export" element={<AdminExportPage />} />
              <Route path="about" element={<AboutDeveloperPage />} />
            </Route>

            {/* keep catch-all last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ExploreFloatingButton />
        </BrowserRouter>
        <SpeedInsights />
      </SessionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
