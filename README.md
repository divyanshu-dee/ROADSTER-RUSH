# ROADSTER RUSH 🚀⚡
### *A Cinematic 3D Flappy Car Adventure — Titanium Silver Edition*

> Inspired by the addictive mechanics of **Flappy Bird**, the playful retro-pixel adventure world of **Codédex**, and the sleek hypercar automotive presentation of the **Tesla Roadster**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![HTML5 Canvas](https://img.shields.io/badge/HTML5_Canvas-60_FPS-orange?style=for-the-badge&logo=html5)
![Web Audio API](https://img.shields.io/badge/Web_Audio-Procedural_Synth-9cf?style=for-the-badge)
![Deploy to Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)

---

## 🎮 The Vision & Vehicle Design

**ROADSTER RUSH** puts you in the cockpit of a realistic, metallic silver electric hypercar inspired by the iconic Tesla Roadster with the SpaceX cold-gas thruster package:

- **Flagship Titanium Silver Body**: Low, wide aerodynamic wedge silhouette with smooth metallic silver paint, graphite lower diffuser panels, and specular sunlight highlights.
- **Glass Canopy**: High-gloss panoramic tinted obsidian glass roof reflecting the sky.
- **Detailed Wheels**: Sculpted wheel arches housing black alloy turbine wheels with spinning multi-spoke blades.
- **Four Functional Underside Thrusters**: Exactly FOUR visible dark metallic exhaust nozzles mounted in perspective along the car's underbody.
- **Four Downward White Air Jets**: Pressing and holding boost fires four powerful, separate white compressed-air jets straight downward beneath the chassis, generating continuous vertical lift with expanding vapor clouds.
- **Aerodynamic Gliding**: Releasing the control shuts off the sustained air jets, letting the white vapor dissolve naturally while gravity pulls the car downward.

---

## 🕹️ Controls

| Action | Desktop Keys | Mouse / Touch |
| :--- | :--- | :--- |
| **Quad Air Thrusters** | Press / Hold `Space` / `Arrow Up` | Press / Hold Left Click / Screen Tap |
| **Pause / Resume** | `Escape` / `P` | Pause Button in HUD |
| **Mute / Unmute** | `M` | Audio Toggle in HUD |
| **Instant Restart** | `Space` / `Enter` | Restart Button in Game Over |

---

## ✨ Features & Architecture

### 1. Realistic Four-Thruster Physics & Engine (60 FPS)
- **Immediate Tap Impulse + Continuous Hold Lift**: Instant response on initial press, with continuous upward thrust while held up to a safe velocity clamp (`-380 px/s`).
- **Four Independent Jet Emitters**: Each of the 4 underside nozzles has its own bright white core, vapor sheath, and procedural expanding particle stream.
- **Velocity-Dependent Attitude**: Nose pitches upward during thrust firing and eases gracefully downward as gravitational descent builds up.
- **Touch & Pointer Reliability**: Full debounce and window-level release listeners prevent stuck thrusters across mobile and desktop.

### 2. Multi-Layer Parallax Scenery (Pixel Velocity)
- **Deep Midnight Sky**: Deep midnight indigo background with starry cosmic depth and synthwave retro moon.
- **Layered Mountains & Cyber Forest**: Teal and indigo peaks with cyan rim lighting and pine silhouettes.
- **Neo-Tokyo Skyline**: 13 architectural skyscrapers featuring lit windows, blinking beacons, and holographic billboards (*"ROADSTER 0-60: 1.9s"*, *"SPACEX THRUST"*).
- **Perspective Corridor**: Converging 3D longitudinal racing grid lines leading to a glowing cyan horizon.
- **5 Obstacle Families**: Quantum Gates, Neon Industrial Pylons, Floating Space Barriers, Cyber Tunnels, and Bonus Gates with holographic warning beacons.

### 3. Hypercar Garage & Progression
- **6 Realistic Automotive Finishes**:
  1. *Titanium Silver* (Flagship Edition — Unlocked by default)
  2. *Graphite Plaid* (Deep metallic carbon-grey with matte diffusers — Score 10+)
  3. *Liquid Platinum* (Hyper-reflective polished mercury mirror finish — Score 20+)
  4. *Midnight Onyx* (Stealth obsidian black with dark tinted glass canopy — 25 Orbs)
  5. *Signature Red* (Multi-coat metallic crimson sports finish — Score 35+)
  6. *Solar Flare Gold* (Polished gold mirror finish — 15 Runs)
- **5 Active Missions**: Iron Glider, Precision Pilot, Plasma Magnet, Break The Limit, and Plaid Overdrive.
- **Downloadable Score Card**: Client-side branded 600x400 PNG graphic card generator with high-res typography and player stats.

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

```bash
npm install
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000).

```bash
npm run build
```

---

## 🌐 Deploy to Vercel

1. Push your repository to **GitHub**:
   ```bash
   git push -u origin master
   ```
2. Import repository in [Vercel](https://vercel.com/new).
3. Framework Preset: **Next.js**
4. Build Command: `npm run build`
5. Output Directory: `.next`
6. Click **Deploy**!
