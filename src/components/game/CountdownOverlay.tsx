'use client';

import React from 'react';

interface CountdownOverlayProps {
  count: number;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ count }) => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none select-none">
      <div className="relative flex flex-col items-center">
        {/* Glowing Background Pulse */}
        <div className="absolute w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl animate-ping" />

        <div className="text-8xl md:text-9xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-300 to-cyan-500 drop-shadow-[0_0_35px_rgba(0,240,255,0.9)] animate-bounce">
          {count > 0 ? count : 'GO!'}
        </div>

        <div className="mt-4 text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-cyan-300 font-mono animate-pulse">
          {count > 0 ? 'CHARGING THRUSTERS...' : 'SPACEX THRUSTER ACTIVE'}
        </div>
      </div>
    </div>
  );
};
