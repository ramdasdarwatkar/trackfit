import { useAuth } from "./context/AuthContext";
import { AppBackground } from "./components/layout/AppBackground";
import { AppRoutes } from "./routes";
import { SplashScreen } from "./components/ui/SplashScreen";

export default function App() {
  const { loading, user_id } = useAuth();

  /**
   * FIX: We only return the Splash component if the app is loading
   * AND we don't even have a user session yet. If we have a user_id,
   * it means the app is just refreshing in the background, so we
   * keep the current route mounted.
   */
  if (loading && !user_id) {
    return <SplashScreen />;
  }

  return (
    <AppBackground>
      <AppRoutes />
    </AppBackground>
  );
}
