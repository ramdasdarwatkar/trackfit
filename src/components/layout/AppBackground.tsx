import React from "react";

export function AppBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full">
      {/* FIXED UNDERLAY */}
      <div className="fixed inset-0 z-0 bg-[#020617] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% -10%, rgba(14, 165, 233, 0.15) 0%, transparent 80%)`,
          }}
        />
      </div>

      {/* CONTENT LAYER - No overflow-hidden here! */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}
