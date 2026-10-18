'use client';

import React, { useState } from 'react';
import { Flame, ShieldAlert, Sparkles, ArrowRight, Check } from 'lucide-react';
import { soundManager } from '@/lib/game/audio';

interface TutorialOverlayProps {
  onDismiss: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onDismiss }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'QUAD UNDERSIDE AIR THRUSTERS',
      subtitle: 'SpaceX Cold Gas Propulsion System',
      description:
        'Press or hold SPACE, ARROW UP, click, or tap to fire four downward white air jets beneath the chassis. Continuous thrust generates vertical lift. Releasing the control allows aerodynamics and gravity to glide downward.',
      icon: <Flame className="w-8 h-8 text-cyan-400" />,
      badge: 'Step 1 of 3',
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40',
    },
    {
      title: 'NAVIGATE ENERGY GATES',
      subtitle: 'Dynamic Quantum Laser Barriers',
      description:
        'Fly smoothly through upper and lower laser pylons. Advanced gates oscillate vertically — watch for golden holographic warning beacons (!).',
      icon: <ShieldAlert className="w-8 h-8 text-pink-400" />,
      badge: 'Step 2 of 3',
      color: 'from-pink-500/20 to-rose-500/10 border-pink-500/40',
    },
    {
      title: 'HARVEST PLASMA CORES',
      subtitle: 'Bonus Score & Hypercar Unlocks',
      description:
        'Collect floating golden and cyan energy orbs to boost your score and unlock exclusive Roadster finishes like Titanium Silver, Graphite Plaid, and Liquid Platinum.',
      icon: <Sparkles className="w-8 h-8 text-amber-400" />,
      badge: 'Step 3 of 3',
      color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/40',
    },
  ];

  const current = steps[step];

  const handleNext = () => {
    soundManager.playClick();
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onDismiss();
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col items-center text-center">
        {/* Step Badge */}
        <div className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono mb-4">
          {current.badge}
        </div>

        {/* Icon Card */}
        <div
          className={`w-20 h-20 rounded-2xl bg-gradient-to-b ${current.color} border flex items-center justify-center mb-4 shadow-lg`}
        >
          {current.icon}
        </div>

        {/* Titles */}
        <h3 className="text-xl font-black font-mono tracking-tight text-white">{current.title}</h3>
        <p className="text-xs font-mono text-cyan-400 mt-0.5 mb-3">{current.subtitle}</p>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed mb-6">
          {current.description}
        </p>

        {/* Step Indicators */}
        <div className="flex items-center gap-2 mb-6">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === step ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black font-mono text-sm tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>{step === steps.length - 1 ? 'READY TO FLY' : 'CONTINUE'}</span>
          {step === steps.length - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>

        {/* Skip Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onDismiss();
          }}
          className="mt-3 text-[11px] font-mono text-slate-500 hover:text-slate-400 transition-colors"
        >
          SKIP TUTORIAL
        </button>
      </div>
    </div>
  );
};
