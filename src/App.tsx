import { useAuth } from "./context/AuthContext";
import { AppRoutes } from "./routes";
import { Splash } from "./components/ui/Splash";
import { SplashScreenProvider as CacheDataLoader } from "./components/ui/SplashScreenProvider";

export default function App() {
  const { loading } = useAuth();

  // Native feel: Show a clean splash screen while Data Loader runs
  if (loading) return <Splash />;

  return (
    <CacheDataLoader>
      <AppRoutes />
    </CacheDataLoader>
  );
}
