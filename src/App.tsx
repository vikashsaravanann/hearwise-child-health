import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/contexts/SessionContext";
import OfflineBadge from "@/components/OfflineBadge";
import AdminGuard from "@/components/AdminGuard";
import AdminLayout from "@/components/AdminLayout";
import LandingPage from "./pages/LandingPage";
import SessionSetupPage from "./pages/SessionSetupPage";
import StudentEntryPage from "./pages/StudentEntryPage";
import HeadphoneCheckPage from "./pages/HeadphoneCheckPage";
import PracticeRoundPage from "./pages/PracticeRoundPage";
import ActiveTestPage from "./pages/ActiveTestPage";
import ResultsPage from "./pages/ResultsPage";
import SessionSummaryPage from "./pages/SessionSummaryPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminSchoolsPage from "./pages/admin/AdminSchoolsPage";
import AdminTeachersPage from "./pages/admin/AdminTeachersPage";
import AdminStudentsPage from "./pages/admin/AdminStudentsPage";
import AdminSessionsPage from "./pages/admin/AdminSessionsPage";
import AdminReferralsPage from "./pages/admin/AdminReferralsPage";
import AdminLoginsPage from "./pages/admin/AdminLoginsPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AboutDeveloperPage from "./pages/admin/AboutDeveloperPage";
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
        <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}>
          <Routes>
            {/* Public screening routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/setup" element={<SessionSetupPage />} />
            <Route path="/student-entry" element={<StudentEntryPage />} />
            <Route path="/headphone-check" element={<HeadphoneCheckPage />} />
            <Route path="/practice" element={<PracticeRoundPage />} />
            <Route path="/test" element={<ActiveTestPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/session-summary" element={<SessionSummaryPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Admin routes */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }
            >
              <Route path="/admin/dashboard" element={<AdminOverviewPage />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="/admin/schools" element={<AdminSchoolsPage />} />
              <Route path="/admin/teachers" element={<AdminTeachersPage />} />
              <Route path="/admin/students" element={<AdminStudentsPage />} />
              <Route path="/admin/sessions" element={<AdminSessionsPage />} />
              <Route path="/admin/referrals" element={<AdminReferralsPage />} />
              <Route path="/admin/logins" element={<AdminLoginsPage />} />
              <Route path="/admin/about" element={<AboutDeveloperPage />} />
            </Route>

            {/* Legacy route redirect */}
            <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
