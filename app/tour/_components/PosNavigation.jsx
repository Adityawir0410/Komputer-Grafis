"use client";
import { useRouter } from "next/navigation";

export default function PosNavigation({ currentPosId, maxPos = 3 }) {
  const router = useRouter();

  const goToNextPos = () => {
    if (currentPosId < maxPos) {
      router.push(`/tour/pos/${currentPosId + 1}`);
    } else {
      // Jika sudah di pos terakhir, redirect ke closing
      router.push("/tour/closing");
    }
  };

  const goToPreviousPos = () => {
    if (currentPosId > 1) {
      router.push(`/tour/pos/${currentPosId - 1}`);
    }
  };

  const goToClosing = () => {
    router.push("/tour/closing");
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-4">
          {/* Previous Button */}
          {currentPosId > 1 && (
            <button
              onClick={goToPreviousPos}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Sebelumnya
            </button>
          )}

          {/* Pos Info */}
          <div className="text-center">
            <p className="text-sm text-gray-600">Pos</p>
            <p className="text-2xl font-bold text-gray-800">{currentPosId}</p>
          </div>

          {/* Next Button */}
          {currentPosId < maxPos ? (
            <button
              onClick={goToNextPos}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Selanjutnya →
            </button>
          ) : (
            <button
              onClick={goToClosing}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Selesai ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

