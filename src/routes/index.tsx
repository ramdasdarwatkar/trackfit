import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoginPage } from "../pages/auth/LoginPage";
import { OnboardingPage } from "../pages/onboarding/OnboardingPage";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { AppLayout } from "../components/layout/AppLayout";
import { SplashScreenProvider } from "../components/ui/SplashScreenProvider";

export const AppRoutes = () => {
  const { user_id, profile, loading } = useAuth();

  // 🔥 THE FIX: While the data loader is running, return null.
  // This prevents the "Authenticated but no Profile" check from triggering too early.
  // Because App.tsx shows <Splash /> when loading is true, the user stays on Splash.
  if (loading) return null;

  // 1. Unauthenticated
  if (!user_id) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  // 2. Authenticated but truly no Profile (Onboarding needed)
  if (!profile) {
    return (
      <Routes>
        <Route path="*" element={<OnboardingPage />} />
      </Routes>
    );
  }

  // 3. Fully Hydrated
  return (
    <SplashScreenProvider>
      <AppLayout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppLayout>
    </SplashScreenProvider>
  );
};
