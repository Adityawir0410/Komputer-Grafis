# Cleanscape VR - Virtual Tour Application

Project ini adalah aplikasi Virtual Tour berbasis web yang dibangun menggunakan **Next.js** dan **A-Frame** untuk pengalaman 3D/360 derajat. Aplikasi ini digunakan untuk simulasi tur edukasi (seperti pengenalan fasilitas pengolahan limbah/air).

## 🏗️ Struktur Code Penting

Berikut adalah struktur folder dan file utama yang perlu Anda pahami:

```
app/
├── api/                    # Backend API Routes (Server-side)
│   └── tour/
│       ├── save-result/    # Endpoint untuk menyimpan skor & waktu ke Database
│       └── delete-result/  # Endpoint hapus data (Admin)
├── tour/                   # Halaman Utama Virtual Tour
│   ├── _components/        # Komponen khusus tur (Pos1, Pos2, UI Navigasi)
│   │   ├── Pos1.jsx        # Contoh Scene 360 Pos 1 (Audio + Gambar 360)
│   │   └── VRNavigation.jsx # Tombol navigasi antar Pos
│   ├── _context/           # State Management (Global Data)
│   │   └── TourContext.jsx # Mengatur Timer, Audio, dan Score global
│   └── page.jsx            # Entry point folder tour
├── layout.jsx              # Layout utama (Global CSS, Font)
└── page.jsx                # Landing Page (Login & Menu Utama)
```

## 🔄 Alur Aplikasi (Flow)

1.  **Landing Page (`app/page.jsx`)**
    *   User membuka web.
    *   A-Frame me-render `LobbyScene` di background.
    *   User login/isi profil via Modal (`LoginModal` / `ProfileModal`).
    *   Setelah login, user diarahkan ke `/tour/briefing`.

2.  **Virtual Tour (`app/tour/`)**
    *   User masuk ke sesi tur.
    *   **Context (`TourContext`)** mulai menghitung waktu (`startTimer`).
    *   **Pos 1 (`Pos1.jsx`)**:
        *   Menampilkan gambar 360 (`<a-sky>`).
        *   Memutar audio penjelasan (`<audio>`).
        *   Navigasi aktif setelah audio/timer selesai.

3.  **Penyimpanan Data (`app/api/`)**
    *   Setelah tur selesai, data user (Nama, NIM, Skor, Waktu) dikirim ke API.
    *   `api/tour/save-result/route.js` menerima data dan menyimpannya ke **Supabase** (Database).

## 🛠️ Tech Stack & Library Utama

*   **Next.js (App Router)**: Framework utama React.
*   **A-Frame (`aframe`)**: Library untuk render objek 3D dan foto 360 di browser.
*   **Supabase (`@supabase/supabase-js`)**: Database untuk menyimpan hasil quiz/tur.
*   **Tailwind CSS**: Styling UI.

## 🌐 Teknologi 3D & WebGL

Aplikasi ini sepenuhnya berbasis pada teknologi **Three.js** dan **WebGL** meskipun tidak selalu terlihat secara langsung dalam kode:

1.  **WebGL**: Fondasi dasar yang digunakan browser untuk merender grafik 3D.
2.  **Three.js**: Library inti yang menangani scene 3D, kamera, dan rendering. Digunakan secara langsung di beberapa komponen (misal: `MiniMap.jsx`).
3.  **A-Frame**: Framework deklaratif (HTML-like) yang dibangun **di atas Three.js**. Sebagian besar scene tour Anda menggunakan ini agar lebih mudah ditulis (contoh: `<a-scene>`, `<a-sky>`).
4.  **React Three Fiber**: Jembatan untuk menggunakan Three.js dalam ekosistem React.

### 📍 Contoh Implementasi dalam Code

Berikut adalah bukti konkret dimana teknologi ini digunakan dalam project Anda:

#### A. Three.js Murni (via React Three Fiber)
Lokasi: `app/tour/_components/MiniMap.jsx`
Di sini Anda menggunakan matematika vektor 3D dan mesh standard Three.js secara langsung untuk membuat peta 3D interaktif.

```javascript
// Import library Three.js
import * as THREE from 'three'; 
import { Canvas, useFrame } from '@react-three/fiber';

// Contoh logika 3D (Vektor & Math)
const start = new THREE.Vector3(...positionsConfig[from].position);
const end = new THREE.Vector3(...positionsConfig[to].position);
const direction = end.clone().sub(start); // Operasi Vektor 3D

// Render Mesh 3D (Geometry + Material)
<mesh rotation={[-Math.PI / 2, 0, -angle]}>
  <planeGeometry args={[0.6, length]} />     {/* Geometri Dasar */}
  <meshStandardMaterial color="#2d3748" />   {/* Material/Texture */}
</mesh>
```

#### B. A-Frame (Abstraksi WebGL)
Lokasi: `app/tour/_components/Pos1.jsx`
A-Frame menyederhanakan kode WebGL yang rumit menjadi tag HTML. Di belakang layar, `<a-sky>` membuat bola raksasa (Sphere Geometry) dengan tekstur di sisi dalam.

```javascript
// Syntax A-Frame (HTML-like)
<a-sky src="/images/360/pos1-360.jpg" rotation="-2 -80 0" />

// Di belakang layar, ini setara dengan kode Three.js:
// const geometry = new THREE.SphereGeometry(500, 60, 40);
// const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
// const sky = new THREE.Mesh(geometry, material);
```

## 🚀 Cara Menjalankan Project

1.  **Install Library**:
    ```bash
    npm install
    ```
2.  **Setup Environment**:
    Pastikan file `.env` sudah berisi URL dan Key Supabase:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=...
    SUPABASE_SERVICE_KEY=...
    ```
3.  **Jalankan Server**:
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000).
