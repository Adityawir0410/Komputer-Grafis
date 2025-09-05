"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MainScene from "../../../_scene/MainScene";
import Pos1 from "../../../_components/Pos1";
import Pos2 from "../../../_components/Pos2";
import Pos3 from "../../../_components/Pos3";
import PosNavigation from "../../../_components/PosNavigation";
import VRLoading from "../../../_components/VRLoading";

export default function PosPage() {
  const params = useParams();
  const [ready, setReady] = useState(false);
  const currentPosId = parseInt(params.id);
  const maxPos = 3;

  useEffect(() => {
    let alive = true;
    (async () => {
      if (typeof window !== "undefined") {
        await import("../../../_aframe/register.client");
        if (alive) setReady(true);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (currentPosId < 1 || currentPosId > maxPos) {
    return (
      <div className="w-full flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Pos Tidak Ditemukan</h1>
          <p className="text-gray-600">Pos {currentPosId} tidak tersedia. Silakan pilih pos 1-{maxPos}.</p>
        </div>
      </div>
    );
  }

  const renderPosContent = () => {
    switch (currentPosId) {
      case 1:
        return <Pos1 />;
      case 2:
        return <Pos2 />;
      case 3:
        return <Pos3 />;
      default:
        return null;
    }
  };

  if (!ready) {
    return <VRLoading />;
  }

  return (
    <div className="relative w-full h-screen">
      <MainScene>
        {renderPosContent()}
      </MainScene>
      <PosNavigation currentPosId={currentPosId} maxPos={maxPos} />
    </div>
  );
}