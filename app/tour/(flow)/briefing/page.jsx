"use client";
import Link from "next/link";
import MainScene from "../../_scene/MainScene";

export default function BriefingPage() {
  return (
    <>
      <MainScene>
        {/* contoh objek 3D */}
        <a-entity
          geometry="primitive: box"
          material="color: #4f46e5"
          position="0 1.25 -3"
          spin="speed: 0.5"
        ></a-entity>
      </MainScene>

      {/* tombol start */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-10">
        <Link
          href="/tour/pos/1"
          className="rounded bg-green-600 text-white px-6 py-3 hover:bg-green-700"
        >
          Mulai ke POS 1
        </Link>
      </div>
    </>
  );
}
