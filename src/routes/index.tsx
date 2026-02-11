import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoginPage } from "../pages/auth/LoginPage";
import { OnboardingPage } from "../pages/onboarding/OnboardingPage";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { SplashScreenProvider } from "../components/ui/SplashScreenProvider";
import { AppLayout } from "../components/layout/AppLayout";

export const AppRoutes = () => {
  const { user_id, profile } = useAuth();

  // 1. Unauthenticated: Login only
  if (!user_id) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  // 2. Authenticated but no Profile: Onboarding only
  if (!profile) {
    return (
      <Routes>
        <Route path="*" element={<OnboardingPage />} />
      </Routes>
    );
  }

  // 3. Fully Hydrated: Wrap pages in Splash and Layout
  return (
    <SplashScreenProvider>
      <AppLayout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add future routes here like /workouts, /stats, /profile */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppLayout>
    </SplashScreenProvider>
  );
};
