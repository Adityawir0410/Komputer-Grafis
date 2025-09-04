"use client";

export default function Pos3() {
  return (
    <>
      {/* Konten VR untuk Pos 3 */}
      <a-box 
        position="0 1 -3" 
        rotation="0 45 0" 
        color="#DC2626"
        animation="property: rotation; to: 0 405 0; loop: true; dur: 10000"
      >
        <a-text 
          value="POS 3" 
          position="0 1 0.6" 
          align="center" 
          color="white"
          width="4"
        ></a-text>
      </a-box>

      {/* Objek unik untuk Pos 3 */}
      <a-cone 
        position="0 1 -4" 
        radius-bottom="0.8" 
        height="1.5" 
        color="#F59E0B"
        animation="property: scale; to: 1.2 1.2 1.2; dir: alternate; loop: true; dur: 1500"
      ></a-cone>

      {/* Tambahan objek untuk Pos 3 */}
      <a-dodecahedron 
        position="-2 1 -2" 
        radius="0.6" 
        color="#EC4899"
        animation="property: rotation; to: 360 360 0; loop: true; dur: 6000"
      ></a-dodecahedron>

      <a-icosahedron 
        position="2 1 -2" 
        radius="0.5" 
        color="#06B6D4"
        animation="property: position; to: 2 2.5 -2; dir: alternate; loop: true; dur: 1800"
      ></a-icosahedron>

      {/* Efek partikel */}
      <a-entity 
        position="0 3 -3"
        particle-system="preset: dust; particleCount: 1000; color: #FBBF24"
      ></a-entity>

      {/* Informasi Pos 3 */}
      <a-text 
        value="Pos 3: Final Destination\nSelamat! Anda telah menyelesaikan tour!" 
        position="0 2.5 -1" 
        align="center" 
        color="#1F2937"
        width="6"
      ></a-text>
    </>
  );
}

