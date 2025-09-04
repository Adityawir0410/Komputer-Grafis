"use client";

export default function PosProgress({ currentPosId, maxPos = 3 }) {
  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex gap-2">
          {Array.from({ length: maxPos }, (_, i) => (
            <div
              key={i + 1}
              className={`w-3 h-3 rounded-full transition-colors ${
                i + 1 <= currentPosId ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-1 text-center">
          {currentPosId} dari {maxPos}
        </p>
      </div>
    </div>
  );
}

