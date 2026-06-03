import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/contexts/SessionContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAuth, RequireAdmin } from "@/components/ProtectedRoute";
import OfflineBadge from "@/components/OfflineBadge";
import SWUpdatePrompt from "@/components/SWUpdatePrompt";
import LanguageToggle from "@/components/LanguageToggle";
import ProtectedRoute from "@/components/ProtectedRoute";
import HearBot from "@/components/HearBot";
import Loader from "@/components/Loader";
import LandingPage from "./pages/LandingPage";
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
const LoginPage = React.lazy(() => import("./pages/Login"));
const AuthCallback = React.lazy(() => import("./pages/AuthCallback"));
const SessionSetupPage = React.lazy(() => import("./pages/SessionSetupPage"));
const StudentEntryPage = React.lazy(() => import("./pages/StudentEntryPage"));
const HeadphoneCheckPage = React.lazy(() => import("./pages/HeadphoneCheckPage"));
const OceanLevelSelectPage = React.lazy(() => import("./pages/OceanLevelSelectPage"));
const OceanTestPage = React.lazy(() => import("./pages/OceanTestPage"));
const LevelResultPage = React.lazy(() => import("./pages/LevelResultPage"));
const SessionSummaryPage = React.lazy(() => import("./pages/SessionSummaryPage"));
const AnimatedDashboardPage = React.lazy(() => import("./pages/AnimatedDashboardPage"));
const GamesPage = React.lazy(() => import("./pages/Games"));
const TrophiesPage = React.lazy(() => import("./pages/Trophies"));
const EarCarePage = React.lazy(() => import("./pages/EarCare"));
const EducationPage = React.lazy(() => import("./pages/Education"));
const LearnPage = React.lazy(() => import("./pages/Learn"));
const SoundExplorerPage = React.lazy(() => import("./pages/SoundExplorer"));
const MyReportPage = React.lazy(() => import("./pages/MyReport"));
const HeadphoneSafetyPage = React.lazy(() => import("./pages/HeadphoneSafety"));
const NoiseAwarenessPage = React.lazy(() => import("./pages/NoiseAwareness"));
const SelfCheckPage = React.lazy(() => import("./pages/SelfCheck"));
const BookAppointmentPage = React.lazy(() => import("./pages/BookAppointment"));
const LeaderboardPage = React.lazy(() => import("./pages/Leaderboard"));
const HelpPage = React.lazy(() => import("./pages/Help"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const HearingHealthPage = React.lazy(() => import("./pages/HearingHealthPage"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const SchoolOnboarding = React.lazy(() => import("./pages/SchoolOnboarding"));
const TeacherTraining = React.lazy(() => import("./pages/TeacherTraining"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const Audiologists = React.lazy(() => import("./pages/Audiologists"));
const WaitlistPage = React.lazy(() => import("./pages/Waitlist"));
const AdminLayout = React.lazy(() => import("./components/AdminLayout"));
const AdminGuard = React.lazy(() => import("./components/AdminGuard"));
const AdminOverviewPage = React.lazy(() => import("./pages/admin/AdminOverviewPage"));
const AdminAnalyticsPage = React.lazy(() => import("./pages/admin/AdminAnalyticsPage"));
const AdminSchoolsPage = React.lazy(() => import("./pages/admin/AdminSchoolsPage"));
const AdminTeachersPage = React.lazy(() => import("./pages/admin/AdminTeachersPage"));
const AdminStudentsPage = React.lazy(() => import("./pages/admin/AdminStudentsPage"));
const AdminSessionsPage = React.lazy(() => import("./pages/admin/AdminSessionsPage"));
const AdminReferralsPage = React.lazy(() => import("./pages/admin/AdminReferralsPage"));
const AdminLoginsPage = React.lazy(() => import("./pages/admin/AdminLoginsPage"));
const AdminSettingsPage = React.lazy(() => import("./pages/admin/AdminSettingsPage"));
const AdminExportPage = React.lazy(() => import("./pages/admin/AdminExportPage"));
const AboutDeveloperPage = React.lazy(() => import("./pages/admin/AboutDeveloperPage"));
const PracticeRoundPage = React.lazy(() => import("./pages/PracticeRoundPage"));
const ActiveTestPage = React.lazy(() => import("./pages/ActiveTestPage"));
const ResultsPage = React.lazy(() => import("./pages/ResultsPage"));
const ThankYouPage = React.lazy(() => import("./pages/ThankYouPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const InnerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/hearing-health" element={<HearingHealthPage />} />
      <Route path="/onboarding" element={<SchoolOnboarding />} />
      <Route path="/teacher-training" element={<TeacherTraining />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/audiologists" element={<Audiologists />} />
      <Route path="/waitlist" element={<WaitlistPage />} />
      
      {/* Protected App Routes */}
      <Route path="/setup" element={<ProtectedRoute><SessionSetupPage /></ProtectedRoute>} />
      <Route path="/student-entry" element={<ProtectedRoute><StudentEntryPage /></ProtectedRoute>} />
      <Route path="/headphone-check" element={<ProtectedRoute><HeadphoneCheckPage /></ProtectedRoute>} />
      <Route path="/ocean-levels" element={<ProtectedRoute><OceanLevelSelectPage /></ProtectedRoute>} />
      <Route path="/ocean-test/:level" element={<ProtectedRoute><OceanTestPage /></ProtectedRoute>} />
      <Route path="/level-result/:level" element={<ProtectedRoute><LevelResultPage /></ProtectedRoute>} />
      <Route path="/session-summary" element={<ProtectedRoute><SessionSummaryPage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute adminOnly={true}><AnimatedDashboardPage /></ProtectedRoute>} />
      <Route path="/games" element={<ProtectedRoute><GamesPage /></ProtectedRoute>} />
      <Route path="/trophies" element={<ProtectedRoute><TrophiesPage /></ProtectedRoute>} />
      <Route path="/ear-care" element={<ProtectedRoute><EarCarePage /></ProtectedRoute>} />
      <Route path="/education" element={<ProtectedRoute><EducationPage /></ProtectedRoute>} />
      <Route path="/learn" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
      <Route path="/sound-explorer" element={<ProtectedRoute><SoundExplorerPage /></ProtectedRoute>} />
      <Route path="/my-report" element={<ProtectedRoute><MyReportPage /></ProtectedRoute>} />
      <Route path="/headphone-safety" element={<ProtectedRoute><HeadphoneSafetyPage /></ProtectedRoute>} />
      <Route path="/noise-awareness" element={<ProtectedRoute><NoiseAwarenessPage /></ProtectedRoute>} />
      <Route path="/self-check" element={<ProtectedRoute><SelfCheckPage /></ProtectedRoute>} />
      <Route path="/book-appointment" element={<ProtectedRoute><BookAppointmentPage /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />

      <Route path="/practice" element={<ProtectedRoute><PracticeRoundPage /></ProtectedRoute>} />
      <Route path="/active-test" element={<ProtectedRoute><ActiveTestPage /></ProtectedRoute>} />
      <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
      <Route path="/thank-you" element={<ProtectedRoute><ThankYouPage /></ProtectedRoute>} />

      {/* Admin */}
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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SessionProvider>
          <Toaster />
          <Sonner />
          <OfflineBadge />
          <LanguageToggle />
          <BrowserRouter basename={import.meta.env.BASE_URL ? import.meta.env.BASE_URL.replace(/\/$/, '') : '/'}>
            <HearBot />
            <Suspense fallback={<Loader fullscreen text="LOADING" />}>
              <InnerRoutes />
            </Suspense>
          </BrowserRouter>
          <SpeedInsights />
        </SessionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
