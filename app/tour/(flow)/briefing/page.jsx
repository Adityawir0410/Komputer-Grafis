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
        {/* 360 Background for Briefing */}
        <a-sky src="/images/360/loby-ipal-sier-360.jpg" rotation="0 -80 0" />

        {/* ✅ Position updated: moved lower and further */}
        <a-plane
          position="0 2.2 -3.05"
          width="6.5"
          height="1.2" 
          color="#fff"
          opacity="0.75"
          material="side: double; transparent: true"
        />

        {/* ✅ Position updated: moved lower and further */}
        <a-text
          value="Welcome to the Virtual Wastewater Treatment Plant!\n\nGet ready to start the tour!"
          position="0 2.2 -3"
          align="center"
          color="#1F2937"
          width="6"
        ></a-text>
      </MainScene>

      {/* Start button */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-10">
        <Link
          href="/tour/pos/1"
          className="rounded bg-green-600 text-white px-6 py-3 hover:bg-green-700 font-medium"
        >
          Proceed to POS 1 (Start Timer)
        </Link>
      </div>
    </div>
  );
}