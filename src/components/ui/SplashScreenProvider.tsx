import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../db/database";
import { supabase } from "../../lib/supabase";
import { Splash } from "./Splash"; // Your TRACKFIT Splash component

export const SplashScreenProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user_id, profile } = useAuth();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const initializeAppData = async () => {
      // If no user or onboarding needed, let the AppRoutes handle it
      if (!user_id || !profile) {
        setIsAppReady(true);
        return;
      }

      try {
        // FAST CHECK: Are muscles and levels already in Dexie?
        const [levelData, musclesCount] = await Promise.all([
          db.athlete_level.get(user_id),
          db.muscles.count(),
        ]);

        // If data exists, we move past the splash quickly
        if (levelData && musclesCount > 0) {
          setTimeout(() => setIsAppReady(true), 800);
          return;
        }

        // SLOW PATH: First login or post-onboarding hydration
        const [levelRes, musclesRes] = await Promise.all([
          supabase
            .from("athlete_level")
            .select("*")
            .eq("user_id", user_id)
            .single(),
          supabase.from("muscles").select("*"),
        ]);

        if (levelRes.data) await db.athlete_level.put(levelRes.data);
        if (musclesRes.data) await db.muscles.bulkPut(musclesRes.data);

        setIsAppReady(true);
      } catch (error) {
        console.error("Hydration Sync Error:", error);
        setIsAppReady(true);
      }
    };

    initializeAppData();
  }, [user_id, profile]);

  return isAppReady ? <>{children}</> : <Splash />;
};
