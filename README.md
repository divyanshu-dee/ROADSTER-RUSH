# ROADSTER RUSH 🚀⚡
### *A Cinematic 3D Flappy Car Adventure*

> Inspired by the addictive mechanics of **Flappy Bird**, the playful retro-pixel adventure world of **Codédex**, and the sleek hypercar automotive presentation of the **Tesla Roadster**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![HTML5 Canvas](https://img.shields.io/badge/HTML5_Canvas-60_FPS-orange?style=for-the-badge&logo=html5)
![Web Audio API](https://img.shields.io/badge/Web_Audio-Procedural_Synth-9cf?style=for-the-badge)
![Deploy to Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)

---

## 🎮 The Vision & Gameplay

**ROADSTER RUSH** puts you in the cockpit of a futuristic electric sports car inspired by the Tesla Roadster. Equipped with SpaceX cold gas thrusters and aerodynamic diffusers, navigate an airborne cyber racing corridor across a neon skyline.

- **Boost Thrust**: Tap, click, or hit `Space` / `Arrow Up` to ignite the rocket thrusters and lift the car.
- **Gravity Gliding**: Release to let gravity pull the car downward, banking and pitching dynamically based on velocity.
- **Dodge Energy Gates**: Laser forcefields and oscillating quantum pylons challenge your reflexes.
- **Collect Energy Orbs**: Pulsing magnetic plasma cores grant bonus points and visual flares.
- **Milestones & Combos**: Passing gates in succession triggers speed ramps, high-velocity audio pitch shifts, and celebrations.

---

## 🕹️ Controls

| Action | Desktop Keys | Mouse / Touch |
| :--- | :--- | :--- |
| **Rocket Boost** | `Space` / `Arrow Up` | Left Click / Screen Tap |
| **Pause / Resume** | `Escape` / `P` | Pause Button in HUD |
| **Mute / Unmute** | `M` | Audio Toggle in HUD |
| **Instant Restart** | `Space` / `Enter` | Restart Button |

---

## ✨ Features & Architecture

### 1. High-Performance Canvas Engine (60 FPS)
- **Delta-Time Physics**: Smooth, frame-independent movement with tick clamping to eliminate physics jitter or tunneling.
- **Normalized Coordinate System (1000 x 600)**: Responsive auto-scaling with retina/high-DPI support across desktop, tablet, and mobile displays.
- **Forgiving Hitboxes**: Precision bounding checks with safety margins around pylon caps to ensure gameplay feels challenging yet fair.

### 2. Multi-Layer Parallax Environment
- **Layer 0**: Deep cosmic indigo sky with twinkling stars and synthwave radial moon.
- **Layer 1**: Layered pixelated mountain ridges with cyber cyan rim lighting.
- **Layer 2**: Illuminated futuristic skyscrapers with animated antennas, lit window arrays, and holographic billboards (*"0-60 in 1.9s"*, *"SpaceX Thruster"*).
- **Layer 3**: High-tech aerial grid highway with illuminated road lines and speed streaks.
- **Layer 4**: Procedural particle systems: rocket exhaust plumes, shock diamonds, impact debris, sparkle dust, and floating score popups.

### 3. Procedural Web Audio API Synthesizer
*100% self-contained — zero external audio files, zero CORS or broken network dependencies!*
- **Four-on-the-Floor Synthwave Music**: Procedural 124 BPM synth bassline and D-minor arpeggio lead.
- **Electric Motor Hum**: Pitch-shifts dynamically with vehicle vertical velocity and thrust state.
- **Rocket Booster Blast**: Dual-band noise burst with frequency ramp.
- **Energy Core Chime**: Celestial harmonic chord upon collecting plasma orbs.
- **Impact Crunch & Glitch**: Metallic sub-bass crash and white noise distortion.
- **Full Control**: Volume sliders for SFX & Music + instant mute toggle with `localStorage` persistence.

### 4. Garage & Progression System
- **6 Unlockable Roadster Finishes**:
  1. *Signature Roadster Red* (Iconic multi-coat metallic red) — Unlocked by default
  2. *Neo Cyberpunk Cyan* (Vibrant electric cyan with magenta glow) — Score 15+ in one run
  3. *Plaid Stealth* (Matte carbon fiber with crimson accents) — Collect 25 total Energy Orbs
  4. *Solar Flare Gold* (Mirror chrome gold with solar thrusters) — Score 30+ in one run
  5. *SpaceX Thruster Edition* (Starship white with rocket nozzles) — Score 50+ in one run
  6. *Synthwave Sunset* (Dual-tone violet-to-pink gradient) — Complete 20 flight runs
- **9 Unlockable Aerospace Achievements**: First Ignition, Aero Navigator, Plaid Velocity, Quantum Glider, Core Harvester, Supercharged Fleet, Endurance Legend, Hypercar Garage, Daily Pioneer.
- **Daily Challenge Mode**: Seeded track based on `YYYY-MM-DD` so players worldwide compete on identical gate layouts each day!

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Graphics**: HTML5 Canvas 2D with dynamic lighting, parallax scrolling, and particle emitters
- **Audio**: Web Audio API (real-time procedural synthesis)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Typography**: Orbitron & Press Start 2P via `next/font/google`

---

## 🚀 Local Development

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd roadster-rush
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

5. **Run production build**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🌐 Deploy to Vercel

This project is 100% client-compatible and optimized for zero-config Vercel deployment:

### Deploy via Vercel Web Dashboard:
1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. Framework Preset: **Next.js**
5. Root Directory: `./`
6. Build Command: `npm run build`
7. Output Directory: `.next`
8. Click **Deploy**!

### Deploy via Vercel CLI:
```bash
npm i -g vercel
vercel
```
