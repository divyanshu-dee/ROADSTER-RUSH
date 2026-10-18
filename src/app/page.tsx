import { RoadsterGame } from '@/components/game/RoadsterGame';

export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden bg-black flex flex-col">
      <RoadsterGame />
    </main>
  );
}
