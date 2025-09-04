"use client";

export default function VRLoading() {
  return (
    <div
      className="w-full bg-gray-100 flex items-center justify-center"
      style={{ height: "calc(100vh - 56px)" }}
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat VR Scene...</p>
      </div>
    </div>
  );
}

