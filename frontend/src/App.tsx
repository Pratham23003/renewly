import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "@/components/renewly/toast";
import { NoiseOverlay } from "@/components/renewly/noise-overlay";

// Pages
import LandingPage from "@/pages/LandingPage";
import DashboardPage from "@/pages/DashboardPage";
import SubscriptionsPage from "@/pages/SubscriptionsPage";
import UpcomingPage from "@/pages/UpcomingPage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/upcoming" element={<UpcomingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <NoiseOverlay />
    </ToastProvider>
  );
}
