import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/contexts/SessionContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAuth, RequireAdmin } from "@/components/ProtectedRoute";
import OfflineBadge from "@/components/OfflineBadge";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import SWUpdatePrompt from "@/components/SWUpdatePrompt";
import PWADevPreview from "@/components/PWADevPreview";
import LanguageToggle from "@/components/LanguageToggle";
import ProtectedRoute from "@/components/ProtectedRoute";
import HearBot from "@/components/HearBot";
import Loader from "@/components/Loader";
import LandingPage from "./pages/LandingPage";
import { AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

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
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/auth/callback" element={<PageTransition><AuthCallback /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/hearing-health" element={<PageTransition><HearingHealthPage /></PageTransition>} />
        <Route path="/onboarding" element={<PageTransition><SchoolOnboarding /></PageTransition>} />
        <Route path="/teacher-training" element={<PageTransition><TeacherTraining /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
        <Route path="/audiologists" element={<PageTransition><Audiologists /></PageTransition>} />
        
        {/* Protected App Routes */}
        <Route path="/setup" element={<PageTransition><ProtectedRoute><SessionSetupPage /></ProtectedRoute></PageTransition>} />
        <Route path="/student-entry" element={<PageTransition><ProtectedRoute><StudentEntryPage /></ProtectedRoute></PageTransition>} />
        <Route path="/headphone-check" element={<PageTransition><ProtectedRoute><HeadphoneCheckPage /></ProtectedRoute></PageTransition>} />
        <Route path="/ocean-levels" element={<PageTransition><ProtectedRoute><OceanLevelSelectPage /></ProtectedRoute></PageTransition>} />
        <Route path="/ocean-test/:level" element={<PageTransition><ProtectedRoute><OceanTestPage /></ProtectedRoute></PageTransition>} />
        <Route path="/level-result/:level" element={<PageTransition><ProtectedRoute><LevelResultPage /></ProtectedRoute></PageTransition>} />
        <Route path="/session-summary" element={<PageTransition><ProtectedRoute><SessionSummaryPage /></ProtectedRoute></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><ProtectedRoute adminOnly={true}><AnimatedDashboardPage /></ProtectedRoute></PageTransition>} />
        <Route path="/games" element={<PageTransition><ProtectedRoute><GamesPage /></ProtectedRoute></PageTransition>} />
        <Route path="/trophies" element={<PageTransition><ProtectedRoute><TrophiesPage /></ProtectedRoute></PageTransition>} />
        <Route path="/ear-care" element={<PageTransition><ProtectedRoute><EarCarePage /></ProtectedRoute></PageTransition>} />
        <Route path="/education" element={<PageTransition><ProtectedRoute><EducationPage /></ProtectedRoute></PageTransition>} />
        <Route path="/learn" element={<PageTransition><ProtectedRoute><LearnPage /></ProtectedRoute></PageTransition>} />
        <Route path="/sound-explorer" element={<PageTransition><ProtectedRoute><SoundExplorerPage /></ProtectedRoute></PageTransition>} />
        <Route path="/my-report" element={<PageTransition><ProtectedRoute><MyReportPage /></ProtectedRoute></PageTransition>} />
        <Route path="/headphone-safety" element={<PageTransition><ProtectedRoute><HeadphoneSafetyPage /></ProtectedRoute></PageTransition>} />
        <Route path="/noise-awareness" element={<PageTransition><ProtectedRoute><NoiseAwarenessPage /></ProtectedRoute></PageTransition>} />
        <Route path="/self-check" element={<PageTransition><ProtectedRoute><SelfCheckPage /></ProtectedRoute></PageTransition>} />
        <Route path="/book-appointment" element={<PageTransition><ProtectedRoute><BookAppointmentPage /></ProtectedRoute></PageTransition>} />
        <Route path="/leaderboard" element={<PageTransition><ProtectedRoute><LeaderboardPage /></ProtectedRoute></PageTransition>} />
        <Route path="/help" element={<PageTransition><ProtectedRoute><HelpPage /></ProtectedRoute></PageTransition>} />

        <Route path="/practice" element={<PageTransition><ProtectedRoute><PracticeRoundPage /></ProtectedRoute></PageTransition>} />
        <Route path="/active-test" element={<PageTransition><ProtectedRoute><ActiveTestPage /></ProtectedRoute></PageTransition>} />
        <Route path="/results" element={<PageTransition><ProtectedRoute><ResultsPage /></ProtectedRoute></PageTransition>} />
        <Route path="/thank-you" element={<PageTransition><ProtectedRoute><ThankYouPage /></ProtectedRoute></PageTransition>} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <PageTransition>
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            </PageTransition>
          }
        >
          <Route index element={<PageTransition><AdminOverviewPage /></PageTransition>} />
          <Route path="dashboard" element={<PageTransition><AdminOverviewPage /></PageTransition>} />
          <Route path="analytics" element={<PageTransition><AdminAnalyticsPage /></PageTransition>} />
          <Route path="schools" element={<PageTransition><AdminSchoolsPage /></PageTransition>} />
          <Route path="teachers" element={<PageTransition><AdminTeachersPage /></PageTransition>} />
          <Route path="students" element={<PageTransition><AdminStudentsPage /></PageTransition>} />
          <Route path="sessions" element={<PageTransition><AdminSessionsPage /></PageTransition>} />
          <Route path="referrals" element={<PageTransition><AdminReferralsPage /></PageTransition>} />
          <Route path="logins" element={<PageTransition><AdminLoginsPage /></PageTransition>} />
          <Route path="settings" element={<PageTransition><AdminSettingsPage /></PageTransition>} />
          <Route path="export" element={<PageTransition><AdminExportPage /></PageTransition>} />
          <Route path="about" element={<PageTransition><AboutDeveloperPage /></PageTransition>} />
        </Route>

        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
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
          <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <HearBot />
            <PWAInstallPrompt />
            <SWUpdatePrompt />
            <PWADevPreview />
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
