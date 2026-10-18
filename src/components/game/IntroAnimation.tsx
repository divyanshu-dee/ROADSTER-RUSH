'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
}

interface IntroParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'vapor' | 'spark' | 'streak';
}

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const particlesRef = useRef<IntroParticle[]>([]);
  const [titleOpacity, setTitleOpacity] = useState(0);
  const [subtitleOpacity, setSubtitleOpacity] = useState(0);
  const [btnOpacity, setBtnOpacity] = useState(0);
  const phaseRef = useRef<'flying' | 'title' | 'done'>('flying');
  const completedRef = useRef(false);

  // Car state for animation
  const carState = useRef({
    x: 0,
    y: 0,
    rotation: 0,
    thrustPower: 1,
    settled: false,
  });

  const handleSkip = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sizing
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    startTimeRef.current = performance.now();

    // Initial car position: below screen
    carState.current.x = canvas.width * 0.5;
    carState.current.y = canvas.height + 100;
    carState.current.rotation = -0.15; // Slight nose-up attitude

    const TOTAL_FLY_DURATION = 2200; // ms - car flies up
    const SETTLE_DURATION = 800; // ms - car settles into idle hover
    const TITLE_DELAY = 2600; // ms - title starts appearing
    const SUBTITLE_DELAY = 3200;
    const BTN_DELAY = 3800;
    const AUTO_ADVANCE = 5500; // ms - auto advance if no tap

    // Target position: center of screen, slightly above center
    const getTargetY = () => canvas.height * 0.42;
    const getTargetX = () => canvas.width * 0.5;

    // Nozzle offsets (relative to car center, scaled)
    const getCarScale = () => Math.min(canvas.width, canvas.height) / 600;

    const nozzleOffsets = [
      { x: 0.18, yOff: 0.55 },
      { x: 0.06, yOff: 0.55 },
      { x: -0.06, yOff: 0.55 },
      { x: -0.18, yOff: 0.55 },
    ];

    const loop = (timestamp: number) => {
      const elapsed = timestamp - startTimeRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width;
      const h = canvas.height;
      const scale = getCarScale();
      const carW = 72 * scale;
      const carH = 25 * scale;

      ctx.clearRect(0, 0, w, h);

      // === BACKGROUND: Deep midnight sky ===
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#020510');
      skyGrad.addColorStop(0.45, '#070f24');
      skyGrad.addColorStop(0.75, '#101738');
      skyGrad.addColorStop(1, '#070c20');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Nebula glow
      const nebulaGrad = ctx.createRadialGradient(
        w * 0.72, h * 0.32, 30 * scale,
        w * 0.72, h * 0.32, 380 * scale
      );
      nebulaGrad.addColorStop(0, 'rgba(0, 240, 255, 0.12)');
      nebulaGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.07)');
      nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, w, h);

      // Twinkling stars
      ctx.save();
      for (let i = 0; i < 60; i++) {
        const sx = ((i * 137.5) % w);
        const sy = ((i * 97.3) % (h * 0.65));
        const twinkle = Math.sin(elapsed * 0.003 + i * 1.5) * 0.3 + 0.7;
        const starSize = (i % 3) * 0.5 + 1;
        ctx.fillStyle = `rgba(210, 240, 255, ${0.5 * twinkle})`;
        ctx.fillRect(sx, sy, starSize * dpr * 0.5, starSize * dpr * 0.5);
      }
      ctx.restore();

      // === CAR ANIMATION ===
      const car = carState.current;
      const targetY = getTargetY();
      const targetX = getTargetX();

      if (elapsed < TOTAL_FLY_DURATION) {
        // Phase 1: Car flies up from below
        const t = elapsed / TOTAL_FLY_DURATION;
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        car.y = (h + 100) + (targetY - (h + 100)) * eased;
        car.x = targetX;
        car.rotation = -0.18 + t * 0.12; // Gradually level out
        car.thrustPower = 1.0 - t * 0.3;
      } else if (elapsed < TOTAL_FLY_DURATION + SETTLE_DURATION) {
        // Phase 2: Settle into hover
        const settleT = (elapsed - TOTAL_FLY_DURATION) / SETTLE_DURATION;
        const settleEase = 1 - Math.pow(1 - settleT, 2);
        car.y = targetY + Math.sin(elapsed * 0.004) * 6 * (1 - settleEase * 0.5);
        car.x = targetX;
        car.rotation = -0.06 * (1 - settleEase) + Math.sin(elapsed * 0.003) * 0.03;
        car.thrustPower = 0.7 - settleEase * 0.35;
        car.settled = true;
      } else {
        // Phase 3: Idle hover
        car.y = targetY + Math.sin(elapsed * 0.002) * 8;
        car.x = targetX;
        car.rotation = Math.sin(elapsed * 0.0015) * 0.04;
        car.thrustPower = 0.3 + Math.sin(elapsed * 0.005) * 0.1;
      }

      // === THRUSTER PARTICLES ===
      if (car.thrustPower > 0.05) {
        nozzleOffsets.forEach((nozzle) => {
          const nx = car.x + nozzle.x * carW;
          const ny = car.y + nozzle.yOff * carH;
          const cosR = Math.cos(car.rotation);
          const sinR = Math.sin(car.rotation);
          const worldX = car.x + (nx - car.x) * cosR - (ny - car.y) * sinR;
          const worldY = car.y + (nx - car.x) * sinR + (ny - car.y) * cosR;

          // Spawn vapor particles
          if (Math.random() < 0.6 * car.thrustPower) {
            const spreadAngle = Math.PI / 2 + car.rotation + (Math.random() - 0.5) * 0.3;
            const speed = (180 + Math.random() * 160) * scale * 0.5;
            particlesRef.current.push({
              x: worldX + (Math.random() - 0.5) * 4 * scale,
              y: worldY,
              vx: Math.cos(spreadAngle) * speed - 30 * scale,
              vy: Math.sin(spreadAngle) * speed,
              life: 0.3 + Math.random() * 0.2,
              maxLife: 0.5,
              size: (3 + Math.random() * 4) * scale,
              color: Math.random() > 0.3 ? '#ffffff' : '#e2e8f0',
              type: 'vapor',
            });
          }

          // Occasional sparks
          if (Math.random() < 0.15 * car.thrustPower) {
            particlesRef.current.push({
              x: worldX,
              y: worldY,
              vx: (Math.random() - 0.5) * 120 * scale,
              vy: (80 + Math.random() * 100) * scale * 0.5,
              life: 0.2 + Math.random() * 0.15,
              maxLife: 0.35,
              size: (1.5 + Math.random() * 2) * scale,
              color: '#00f0ff',
              type: 'spark',
            });
          }
        });
      }

      // Speed streaks during flight phase
      if (elapsed < TOTAL_FLY_DURATION) {
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: 0,
            vy: (200 + Math.random() * 400) * scale * 0.5,
            life: 0.15 + Math.random() * 0.2,
            maxLife: 0.35,
            size: (1 + Math.random()) * scale,
            color: `rgba(0, 240, 255, ${0.3 + Math.random() * 0.3})`,
            type: 'streak',
          });
        }
      }

      // Update and render particles
      const dt = 0.016;
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.globalAlpha = alpha;

        if (p.type === 'vapor') {
          const expandSize = p.size * (1 + (1 - alpha) * 2.5);
          const vaporGrad = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, expandSize);
          vaporGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.85})`);
          vaporGrad.addColorStop(0.5, `rgba(230, 240, 250, ${alpha * 0.45})`);
          vaporGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = vaporGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, expandSize, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'streak') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y - 30 * scale);
          ctx.stroke();
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      ctx.globalAlpha = 1;

      // Keep particle count manageable
      if (particlesRef.current.length > 200) {
        particlesRef.current.splice(0, particlesRef.current.length - 200);
      }

      // === DRAW THE ROADSTER ===
      ctx.save();
      ctx.translate(car.x, car.y);
      ctx.rotate(car.rotation);
      ctx.scale(scale, scale);

      const cW = 72;

      const thrust = car.thrustPower;

      // Thruster jets underneath
      if (thrust > 0.05) {
        ctx.save();
        // Underglow
        const underglowGrad = ctx.createRadialGradient(0, 18, 5, 0, 24, cW * 0.6);
        underglowGrad.addColorStop(0, `rgba(255, 255, 255, ${0.5 * thrust})`);
        underglowGrad.addColorStop(0.5, `rgba(225, 238, 255, ${0.22 * thrust})`);
        underglowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = underglowGrad;
        ctx.fillRect(-cW * 0.5, 9, cW, 50);

        // Render 4 air jets
        [
          { x: 0.18, y: 8.5 },
          { x: 0.06, y: 8.5 },
          { x: -0.06, y: 8.5 },
          { x: -0.18, y: 8.5 },
        ].forEach((offset, idx) => {
          const nx = offset.x * cW;
          const ny = offset.y;
          const microFlicker = Math.sin(elapsed * 0.048 + idx * 2.2) * 4;
          const jetLength = (42 + idx % 2 * 8 + microFlicker) * thrust;
          const jetWidth = 7.5 * thrust;

          const outerGrad = ctx.createLinearGradient(nx, ny, nx, ny + jetLength);
          outerGrad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * thrust})`);
          outerGrad.addColorStop(0.3, `rgba(235, 245, 255, ${0.7 * thrust})`);
          outerGrad.addColorStop(0.7, `rgba(215, 230, 245, ${0.4 * thrust})`);
          outerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = outerGrad;
          ctx.beginPath();
          ctx.moveTo(nx - jetWidth * 0.5, ny);
          ctx.lineTo(nx + jetWidth * 0.5, ny);
          ctx.lineTo(nx + jetWidth * 1.6, ny + jetLength);
          ctx.lineTo(nx - jetWidth * 1.6, ny + jetLength);
          ctx.closePath();
          ctx.fill();

          // Core beam
          const coreGrad = ctx.createLinearGradient(nx, ny, nx, ny + jetLength * 0.65);
          coreGrad.addColorStop(0, '#ffffff');
          coreGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.95)');
          coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.moveTo(nx - 2, ny);
          ctx.lineTo(nx + 2, ny);
          ctx.lineTo(nx + 1, ny + jetLength * 0.65);
          ctx.lineTo(nx - 1, ny + jetLength * 0.65);
          ctx.closePath();
          ctx.fill();

          // Nozzle glow dot
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(nx, ny + 1, 3 * thrust, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
        ctx.restore();
      }

      // Nozzle housings
      [
        { x: 0.18, y: 8.5 },
        { x: 0.06, y: 8.5 },
        { x: -0.06, y: 8.5 },
        { x: -0.18, y: 8.5 },
      ].forEach((offset) => {
        const nx = offset.x * cW;
        const ny = offset.y;
        ctx.fillStyle = '#1c212a';
        ctx.fillRect(nx - 3.5, ny - 3.5, 7, 4.5);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.strokeRect(nx - 3.5, ny - 3.5, 7, 4.5);
        ctx.fillStyle = thrust > 0.05 ? '#ffffff' : '#0c0e14';
        ctx.beginPath();
        ctx.ellipse(nx, ny + 0.5, 2.8, 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // === CAR BODY (Same as carRenderer) ===
      ctx.save();

      // Lower graphite panel
      ctx.beginPath();
      ctx.moveTo(-cW * 0.46, 7.5);
      ctx.lineTo(cW * 0.48, 7.5);
      ctx.lineTo(cW * 0.45, 9.5);
      ctx.lineTo(-cW * 0.44, 9.5);
      ctx.closePath();
      ctx.fillStyle = '#1e2430';
      ctx.fill();

      // Main body
      ctx.beginPath();
      ctx.moveTo(-cW * 0.46, 7.5);
      ctx.lineTo(-cW * 0.47, -1.5);
      ctx.lineTo(-cW * 0.44, -4.5);
      ctx.quadraticCurveTo(-cW * 0.28, -6.5, -cW * 0.16, -7.5);
      ctx.quadraticCurveTo(0, -14.5, cW * 0.16, -7.5);
      ctx.quadraticCurveTo(cW * 0.36, -4, cW * 0.49, 1.5);
      ctx.lineTo(cW * 0.50, 4.5);
      ctx.lineTo(cW * 0.45, 7.5);
      ctx.lineTo(cW * 0.32, 7.5);
      ctx.arc(cW * 0.24, 7.5, 8.5, 0, Math.PI, true);
      ctx.lineTo(-cW * 0.16, 7.5);
      ctx.arc(-cW * 0.24, 7.5, 8.5, 0, Math.PI, true);
      ctx.lineTo(-cW * 0.46, 7.5);
      ctx.closePath();

      const bodyGrad = ctx.createLinearGradient(0, -14.5, 0, 9.5);
      bodyGrad.addColorStop(0, '#f8fafc');
      bodyGrad.addColorStop(0.35, '#cbd5e1');
      bodyGrad.addColorStop(0.7, '#cbd5e1');
      bodyGrad.addColorStop(1, '#94a3b8');
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Specular highlight
      ctx.beginPath();
      ctx.moveTo(-cW * 0.40, -2.5);
      ctx.quadraticCurveTo(0, -5.5, cW * 0.43, 0.5);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Door line
      ctx.beginPath();
      ctx.moveTo(cW * 0.05, -6.5);
      ctx.lineTo(cW * 0.03, 6.5);
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Hood crease
      ctx.beginPath();
      ctx.moveTo(cW * 0.17, -5);
      ctx.lineTo(cW * 0.42, 0.5);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // Glass canopy
      ctx.beginPath();
      ctx.moveTo(-cW * 0.19, -6.5);
      ctx.quadraticCurveTo(0, -13, cW * 0.14, -6.5);
      ctx.lineTo(cW * 0.19, -3.5);
      ctx.lineTo(-cW * 0.16, -3.5);
      ctx.closePath();

      const canopyGrad = ctx.createLinearGradient(0, -13, 0, -3.5);
      canopyGrad.addColorStop(0, 'rgba(215, 235, 255, 0.85)');
      canopyGrad.addColorStop(0.35, 'rgba(15, 23, 42, 0.96)');
      canopyGrad.addColorStop(1, 'rgba(6, 9, 18, 0.98)');
      ctx.fillStyle = canopyGrad;
      ctx.fill();

      // Glass glare
      ctx.beginPath();
      ctx.moveTo(-cW * 0.04, -11);
      ctx.lineTo(cW * 0.06, -5.5);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // Front LED
      ctx.beginPath();
      ctx.moveTo(cW * 0.45, 1.5);
      ctx.lineTo(cW * 0.49, 2.5);
      ctx.lineTo(cW * 0.44, 4);
      ctx.strokeStyle = '#f8fafc';
      ctx.shadowColor = '#f8fafc';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Headlight beam
      const beamGrad = ctx.createLinearGradient(cW * 0.49, 2.5, cW * 0.49 + 60, 3.5);
      beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(cW * 0.49, 2.5);
      ctx.lineTo(cW * 0.49 + 60, -3);
      ctx.lineTo(cW * 0.49 + 60, 9);
      ctx.closePath();
      ctx.fill();

      // Rear LED
      ctx.beginPath();
      ctx.moveTo(-cW * 0.45, -2);
      ctx.lineTo(-cW * 0.47, 1.5);
      ctx.strokeStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Wheels
      const drawWheel = (wx: number, wy: number) => {
        ctx.save();
        ctx.translate(wx, wy);
        ctx.fillStyle = '#0a0d14';
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1e2430';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#181d26';
        ctx.beginPath();
        ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.rotate(-elapsed * 0.028);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.1;
        for (let s = 0; s < 5; s++) {
          ctx.rotate((Math.PI * 2) / 5);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, 5);
          ctx.stroke();
        }
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(0, 0, 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      drawWheel(cW * 0.24, 7.5);
      drawWheel(-cW * 0.24, 7.5);

      ctx.restore(); // End body save
      ctx.restore(); // End transform

      // === PHASE TRANSITIONS ===
      if (elapsed >= TITLE_DELAY && phaseRef.current === 'flying') {
        phaseRef.current = 'title';
      }

      // Smooth fade-in for title elements
      if (elapsed >= TITLE_DELAY) {
        const titleT = Math.min(1, (elapsed - TITLE_DELAY) / 600);
        setTitleOpacity(titleT);
      }
      if (elapsed >= SUBTITLE_DELAY) {
        const subT = Math.min(1, (elapsed - SUBTITLE_DELAY) / 500);
        setSubtitleOpacity(subT);
      }
      if (elapsed >= BTN_DELAY) {
        const btnT = Math.min(1, (elapsed - BTN_DELAY) / 500);
        setBtnOpacity(btnT);
      }

      // Auto advance
      if (elapsed >= AUTO_ADVANCE && !completedRef.current) {
        completedRef.current = true;
        onComplete();
        return;
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black select-none"
      onClick={handleSkip}
      onTouchStart={handleSkip}
    >
      {/* Canvas for car + particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ touchAction: 'none' }}
      />

      {/* Overlaid UI elements */}
      <div className="relative z-10 flex flex-col items-center text-center pointer-events-none px-4">
        {/* Title */}
        <div
          style={{ opacity: titleOpacity, transform: `translateY(${(1 - titleOpacity) * 30}px)` }}
          className="transition-none"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-cyan-500 font-mono select-none"
            style={{ filter: `drop-shadow(0 0 25px rgba(0,240,255,0.7))` }}
          >
            ROADSTER<span className="text-cyan-400">RUSH</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div
          style={{ opacity: subtitleOpacity, transform: `translateY(${(1 - subtitleOpacity) * 20}px)` }}
          className="mt-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase">
            <span>⚡</span>
            <span>A Cinematic 3D Flappy Car Adventure</span>
          </div>
        </div>

        {/* Tap to continue */}
        <div
          style={{ opacity: btnOpacity }}
          className="mt-8"
        >
          <div className="text-xs sm:text-sm font-mono text-slate-400 animate-pulse pointer-events-auto">
            TAP ANYWHERE TO CONTINUE
          </div>
        </div>
      </div>
    </div>
  );
};
