import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoginPage } from "../pages/auth/LoginPage";
import { OnboardingPage } from "../pages/onboarding/OnboardingPage";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { SplashScreenProvider } from "../components/ui/SplashScreenProvider";

export const AppRoutes = () => {
  const { user_id, profile } = useAuth();

  if (!user_id)
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );

  if (!profile)
    return (
      <Routes>
        <Route path="*" element={<OnboardingPage />} />
      </Routes>
    );

  return (
    <SplashScreenProvider>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </SplashScreenProvider>
  );
};
