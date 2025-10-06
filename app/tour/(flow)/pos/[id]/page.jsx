// File: app/tour/(flow)/pos/[id]/page.jsx

"use client";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

// ✅ PATH DIPERBAIKI: Mengarah ke 'app/tour/_components'
import VRLoading from "../../../_components/VRLoading";
import HUD from "../../../_components/HUD";
import Pos1 from "../../../_components/Pos1";
import Pos2 from "../../../_components/Pos2";
import Pos3 from "../../../_components/Pos3";
import Pos4 from "../../../_components/Pos4";
import Pos5 from "../../../_components/Pos5";
import Pos6 from "../../../_components/Pos6";
import Pos7 from "../../../_components/Pos7";

// ✅ PATH DIPERBAIKI: Mengarah ke 'app/_components'
const AFrameWrapper = dynamic(
  () => import('../../../../_components/AFrameWrapper'),
  { ssr: false, loading: () => <VRLoading /> }
);

export default function PosPage() {
  const params = useParams();
  const currentPosId = parseInt(params.id);

  const renderPosContent = () => {
    switch (currentPosId) {
      case 1: return <Pos1 />;
      case 2: return <Pos2 />;
      case 3: return <Pos3 />;
      case 4: return <Pos4 />;
      case 5: return <Pos5 />;
      case 6: return <Pos6 />;
      case 7: return <Pos7 />;
      default: return null;
    }
  };

  return (
    <div className="relative w-screen h-screen">
      <HUD />
      <AFrameWrapper> 
        {renderPosContent()}
      </AFrameWrapper>
    </div>
  );
}