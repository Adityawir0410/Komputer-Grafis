"use client";

export default function Pos1() {
  return (
    <>
      {/* Konten VR untuk Pos 1 */}
      <a-box 
        position="0 1 -3" 
        rotation="0 45 0" 
        color="#4F46E5"
        animation="property: rotation; to: 0 405 0; loop: true; dur: 10000"
      >
        <a-text 
          value="POS 1" 
          position="0 1 0.6" 
          align="center" 
          color="white"
          width="4"
        ></a-text>
      </a-box>

      {/* Objek unik untuk Pos 1 */}
      <a-sphere 
        position="-2 1 -2" 
        radius="0.5" 
        color="#EF4444"
        animation="property: position; to: -2 2 -2; dir: alternate; loop: true; dur: 2000"
      ></a-sphere>

      {/* Tambahan objek untuk Pos 1 */}
      <a-torus 
        position="2 1 -2" 
        radius="0.8" 
        radius-tubular="0.2" 
        color="#8B5CF6"
        animation="property: rotation; to: 360 0 0; loop: true; dur: 4000"
      ></a-torus>

      {/* Informasi Pos 1 */}
      <a-text 
        value="Selamat datang di Pos 1!\nIni adalah area pertama dalam tour VR." 
        position="0 2.5 -1" 
        align="center" 
        color="#1F2937"
        width="6"
      ></a-text>
    </>
  );
}

