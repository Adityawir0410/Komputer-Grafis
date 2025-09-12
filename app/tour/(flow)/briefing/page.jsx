"use client";
import Link from "next/link";
import MainScene from "../../_scene/MainScene";

export default function BriefingPage() {
  return (
    <div className="relative w-full h-screen">
      {/* SFX: welcoming sound on briefing page */}
      <audio
        src="/sounds/sfx_1_wellcoming.MP3"
        autoPlay
        preload="auto"
        playsInline
      />
      <MainScene>
        {/* contoh objek 3D */}
        <a-entity
          geometry="primitive: box"
          material="color: #4f46e5"
          position="0 1.25 -3"
          spin="speed: 0.5"
        ></a-entity>

        {/* Briefing text */}
        <a-text
          value="Selamat datang di Virtual Wastewater Treatment Plant!\n\nTimer akan dimulai ketika Anda mencapai Pos 1.\nBersiaplah untuk memulai tour!"
          position="0 2.5 -2"
          align="center"
          color="#1F2937"
          width="6"
        ></a-text>
      </MainScene>

      {/* tombol start */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-10">
        <Link
          href="/tour/pos/1"
          className="rounded bg-green-600 text-white px-6 py-3 hover:bg-green-700 font-medium"
        >
          Mulai ke POS 1 (Start Timer)
        </Link>
      </div>
    </div>
  );
}
