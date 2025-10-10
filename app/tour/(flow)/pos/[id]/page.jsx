// File: app/tour/(flow)/pos/[id]/page.jsx

"use client";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect } from "react";
// ✅ PATH DIPERBAIKI: Path ini mengarah ke app/tour/_context/
import { useTour } from "../../../_context/TourContext";

import VRLoading from "../../../_components/VRLoading";
import HUD from "../../../_components/HUD";
import PointerOverlay from "../../../_components/PointerOverlay";
import Pos1 from "../../../_components/Pos1";
import Pos2 from "../../../_components/Pos2";
import Pos3 from "../../../_components/Pos3";
import Pos4 from "../../../_components/Pos4";
import Pos5 from "../../../_components/Pos5";
import Pos6 from "../../../_components/Pos6";

const AFrameWrapper = dynamic(
  () => import('../../../../_components/AFrameWrapper'),
  { ssr: false, loading: () => <VRLoading /> }
);

export default function PosPage() {
  const params = useParams();
  const router = useRouter();
  const { highestPosReached, isInitialized, setIsCenterPointerMode } = useTour();
  const currentPosId = parseInt(params.id, 10);

  useEffect(() => {
    if (isInitialized) {
      if (currentPosId > highestPosReached + 1) {
        console.log(`Akses ke Pos ${currentPosId} ditolak. Pos terjauh: ${highestPosReached}. Mengembalikan...`);
        if (highestPosReached === 0) {
            router.replace('/tour/briefing');
        } else {
            router.replace(`/tour/pos/${highestPosReached}`);
        }
      }
    }
  }, [currentPosId, highestPosReached, isInitialized, router]);

  // Default: enable center pointer mode on POS pages
  useEffect(() => {
    setIsCenterPointerMode(true);
    return () => setIsCenterPointerMode(false);
  }, [setIsCenterPointerMode]);

  if (!isInitialized || currentPosId > highestPosReached + 1) {
    return <VRLoading />;
  }

  const renderPosContent = () => {
    switch (currentPosId) {
      case 1: return <Pos1 />;
      case 2: return <Pos2 />;
      case 3: return <Pos3 />;
      case 4: return <Pos4 />;
      case 5: return <Pos5 />;
      case 6: return <Pos6 />;
      default: return null;
    }
  };

  return (
    <div className="relative w-screen h-screen">
      <HUD />
      <PointerOverlay />
      <AFrameWrapper> 
        {renderPosContent()}
      </AFrameWrapper>
    </div>
  );
}