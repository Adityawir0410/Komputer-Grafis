// /tour/_components/MiniMap.jsx
"use client";

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox } from '@react-three/drei';
import { useTour } from '../_context/TourContext';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

// Konfigurasi posisi setiap Pos dalam koordinat 3D - Layout seperti jalan di kota
const positionsConfig = [
  { id: 1, name: 'Start', position: [-4, 0, 2], color: '#3B82F6', buildingHeight: 1.2 },
  { id: 2, name: 'Area A', position: [-2, 0, -1], color: '#8B5CF6', buildingHeight: 1.5 },
  { id: 3, name: 'Center', position: [0, 0, 1], color: '#10B981', buildingHeight: 1.8 },
  { id: 4, name: 'Area B', position: [2, 0, -1], color: '#F59E0B', buildingHeight: 1.4 },
  { id: 5, name: 'Area C', position: [4, 0, 1], color: '#EF4444', buildingHeight: 1.6 },
  { id: 6, name: 'Finish', position: [6, 0, -1], color: '#EC4899', buildingHeight: 2.0 },
];

// Koneksi jalan antar pos
const roadConnections = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
];

// Komponen Ground/Tanah
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, -0.05, 0]} receiveShadow>
      <planeGeometry args={[16, 10]} />
      <meshStandardMaterial color="#1a472a" roughness={0.8} />
    </mesh>
  );
}

// Komponen untuk jalan
function Road({ from, to, isCompleted }) {
  const start = new THREE.Vector3(...positionsConfig[from].position);
  const end = new THREE.Vector3(...positionsConfig[to].position);
  
  const direction = end.clone().sub(start);
  const length = direction.length();
  const center = start.clone().add(direction.clone().multiplyScalar(0.5));
  const angle = Math.atan2(end.x - start.x, end.z - start.z);
  
  return (
    <group>
      {/* Jalan utama */}
      <mesh 
        position={[center.x, 0.01, center.z]} 
        rotation={[-Math.PI / 2, 0, -angle]}
        receiveShadow
      >
        <planeGeometry args={[0.6, length]} />
        <meshStandardMaterial 
          color={isCompleted ? "#4a5568" : "#2d3748"} 
          roughness={0.9}
        />
      </mesh>
      
      {/* Garis tengah jalan */}
      <mesh 
        position={[center.x, 0.02, center.z]} 
        rotation={[-Math.PI / 2, 0, -angle]}
      >
        <planeGeometry args={[0.05, length]} />
        <meshBasicMaterial 
          color={isCompleted ? "#fbbf24" : "#4b5563"} 
        />
      </mesh>
    </group>
  );
}

// Komponen Gedung/Building untuk setiap Pos
function Building({ pos, isActive, isCompleted, isAccessible, onClick, isHovered, setHovered }) {
  const groupRef = useRef();
  const buildingRef = useRef();
  const beaconRef = useRef();
  const ringRef = useRef();
  
  const baseHeight = pos.buildingHeight;
  
  useFrame((state) => {
    // Animasi beacon untuk pos aktif
    if (beaconRef.current && isActive) {
      beaconRef.current.position.y = baseHeight + 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      beaconRef.current.rotation.y += 0.02;
    }
    
    // Animasi ring pulse untuk pos aktif
    if (ringRef.current && isActive) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      ringRef.current.scale.set(scale, scale, scale);
    }
    
    // Hover animation
    if (groupRef.current && isAccessible) {
      const targetY = isHovered ? 0.1 : 0;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
    }
  });

  const getBuildingColor = () => {
    if (isActive) return '#ffffff';
    if (isCompleted) return '#22c55e';
    if (isAccessible) return pos.color;
    return '#374151';
  };

  const getRoofColor = () => {
    if (isActive) return pos.color;
    if (isCompleted) return '#16a34a';
    if (isAccessible) return pos.color;
    return '#1f2937';
  };

  return (
    <group 
      ref={groupRef}
      position={[pos.position[0], 0, pos.position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        if (isAccessible) onClick(pos.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (isAccessible) {
          setHovered(pos.id);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(null);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Platform/Base */}
      <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.8, 0.9, 0.1, 6]} />
        <meshStandardMaterial 
          color={isActive ? pos.color : (isCompleted ? '#166534' : '#1f2937')} 
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Building Body */}
      <RoundedBox
        ref={buildingRef}
        args={[0.7, baseHeight, 0.7]}
        radius={0.05}
        smoothness={4}
        position={[0, baseHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color={getBuildingColor()}
          metalness={0.2}
          roughness={0.6}
          emissive={isActive ? pos.color : (isHovered && isAccessible ? pos.color : '#000000')}
          emissiveIntensity={isActive ? 0.5 : (isHovered ? 0.3 : 0)}
        />
      </RoundedBox>
      
      {/* Roof */}
      <mesh position={[0, baseHeight + 0.15, 0]} castShadow>
        <coneGeometry args={[0.5, 0.4, 6]} />
        <meshStandardMaterial 
          color={getRoofColor()}
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>
      
      {/* Windows */}
      {[0, Math.PI/2, Math.PI, -Math.PI/2].map((rotation, i) => (
        <mesh 
          key={i} 
          position={[
            Math.sin(rotation) * 0.351, 
            baseHeight * 0.5, 
            Math.cos(rotation) * 0.351
          ]}
          rotation={[0, rotation, 0]}
        >
          <planeGeometry args={[0.2, 0.25]} />
          <meshBasicMaterial 
            color={isActive || isCompleted ? '#fef3c7' : '#0f172a'} 
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Active Beacon */}
      {isActive && (
        <group ref={beaconRef} position={[0, baseHeight + 0.5, 0]}>
          <mesh>
            <octahedronGeometry args={[0.15, 0]} />
            <meshStandardMaterial 
              color={pos.color} 
              emissive={pos.color}
              emissiveIntensity={1}
              metalness={0.8}
            />
          </mesh>
          {/* Light beam */}
          <pointLight color={pos.color} intensity={2} distance={3} />
        </group>
      )}
      
      {/* Active Ring */}
      {isActive && (
        <mesh ref={ringRef} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.1, 32]} />
          <meshBasicMaterial color={pos.color} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
      
      {/* Completed Checkmark Flag */}
      {isCompleted && !isActive && (
        <group position={[0.4, baseHeight + 0.3, 0.4]}>
          {/* Flag pole */}
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
            <meshStandardMaterial color="#71717a" metalness={0.8} />
          </mesh>
          {/* Flag */}
          <mesh position={[0.1, 0.15, 0]}>
            <planeGeometry args={[0.2, 0.15]} />
            <meshBasicMaterial color="#22c55e" side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
      
      {/* Lock Icon for inaccessible */}
      {!isAccessible && !isCompleted && (
        <mesh position={[0, baseHeight + 0.5, 0]}>
          <boxGeometry args={[0.2, 0.25, 0.1]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      )}
      
      {/* Pos Number Label */}
      <Text
        position={[0, baseHeight + 0.8, 0]}
        fontSize={0.25}
        color={isActive ? '#ffffff' : (isAccessible ? '#e5e7eb' : '#6b7280')}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {`Pos ${pos.id}`}
      </Text>
    </group>
  );
}

// Pohon dekoratif
function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.4, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <coneGeometry args={[0.25, 0.5, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <coneGeometry args={[0.18, 0.4, 8]} />
        <meshStandardMaterial color="#16a34a" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Lampu jalan
function StreetLamp({ position }) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.8, 8]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.8} />
      </mesh>
      {/* Lamp head */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color="#fef3c7" 
          emissive="#fbbf24"
          emissiveIntensity={0.5}
        />
      </mesh>
      <pointLight position={[0, 0.85, 0]} color="#fef3c7" intensity={0.5} distance={2} />
    </group>
  );
}

// Scene utama
function CityScene({ onPosClick }) {
  const { currentPos, highestPosReached, quizCompleted, audioCompleted } = useTour();
  const [hoveredPos, setHoveredPos] = useState(null);
  const sceneRef = useRef();
  
  // Rotasi scene perlahan
  useFrame((state) => {
    if (sceneRef.current) {
      // Subtle floating animation for the whole scene
      sceneRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });
  
  return (
    <group ref={sceneRef}>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.3} color="#60a5fa" />
      
      {/* Ground */}
      <Ground />
      
      {/* Roads */}
      {roadConnections.map(([from, to], index) => (
        <Road 
          key={index} 
          from={from} 
          to={to} 
          isCompleted={to + 1 <= highestPosReached}
        />
      ))}
      
      {/* Buildings/Pos */}
      {positionsConfig.map((pos) => {
        const isActive = currentPos === pos.id;
        const isCompleted = audioCompleted?.[pos.id] || quizCompleted?.[pos.id];
        const isAccessible = pos.id <= (highestPosReached || 0) + 1;
        
        return (
          <Building
            key={pos.id}
            pos={pos}
            isActive={isActive}
            isCompleted={isCompleted}
            isAccessible={isAccessible}
            onClick={onPosClick}
            isHovered={hoveredPos === pos.id}
            setHovered={setHoveredPos}
          />
        );
      })}
      
      {/* Decorative Trees */}
      <Tree position={[-5, 0, 0]} scale={0.8} />
      <Tree position={[-3, 0, -2.5]} scale={0.6} />
      <Tree position={[1, 0, 3]} scale={0.7} />
      <Tree position={[3, 0, -2.5]} scale={0.9} />
      <Tree position={[5, 0, 3]} scale={0.6} />
      <Tree position={[7, 0, 0.5]} scale={0.8} />
      
      {/* Street Lamps */}
      <StreetLamp position={[-2.5, 0, 1]} />
      <StreetLamp position={[0.5, 0, -1.5]} />
      <StreetLamp position={[3.5, 0, 2]} />
      <StreetLamp position={[5.5, 0, -2]} />
    </group>
  );
}

// Loading component
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#4B5563" wireframe />
    </mesh>
  );
}

// Komponen MiniMap utama
export default function MiniMap() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { currentPos, highestPosReached, isInitialized } = useTour();
  
  // Pastikan komponen sudah mounted di client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handlePosClick = (posId) => {
    if (posId <= (highestPosReached || 0) + 1) {
      router.push(`/tour/pos/${posId}`);
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'm' || e.key === 'M') {
        setIsVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Jangan render sampai mounted dan initialized
  if (!mounted || !isInitialized) return null;
  
  return (
    <div 
      className="fixed z-30 pointer-events-auto"
      style={{
        bottom: '24px',
        right: '24px',
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="absolute -top-8 right-0 bg-black/80 hover:bg-black text-white px-3 py-1 rounded-t-lg text-xs backdrop-blur-sm transition-all flex items-center gap-1"
        title="Toggle Mini Map (M)"
      >
        🗺️ {isVisible ? 'Hide' : 'Show'} Map
      </button>
      
      {isVisible && (
        <div 
          className={`relative rounded-xl overflow-hidden border-2 border-gray-600 shadow-2xl transition-all duration-300 ${
            isExpanded ? 'w-[600px] h-[400px]' : 'w-[320px] h-[220px]'
          }`}
          style={{
            background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          }}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-2 flex justify-between items-center">
            <span className="text-white text-xs font-bold flex items-center gap-2">
              🏙️ Tour Map
              <span className="text-gray-400 text-[10px] font-normal">
                Pos {currentPos || 0}/{positionsConfig.length}
              </span>
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-300 hover:text-white transition-colors text-sm px-2 py-0.5 rounded hover:bg-white/20"
              title={isExpanded ? 'Minimize' : 'Expand'}
            >
              {isExpanded ? '⊖' : '⊕'}
            </button>
          </div>
          
          {/* Three.js Canvas */}
          <Canvas
            shadows
            camera={{ 
              position: isExpanded ? [0, 12, 12] : [0, 10, 10], 
              fov: 45,
              near: 0.1,
              far: 100
            }}
            style={{ background: 'transparent' }}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <CityScene onPosClick={handlePosClick} />
              <OrbitControls 
                enablePan={false}
                enableZoom={isExpanded}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2.5}
                minDistance={8}
                maxDistance={20}
                autoRotate={!isExpanded}
                autoRotateSpeed={0.5}
              />
            </Suspense>
          </Canvas>
          
          {/* Legend */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
            <div className="flex justify-center gap-3 text-[10px] text-gray-300">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-white shadow-lg shadow-white/50"></span> Current
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-green-500"></span> Done
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-blue-500"></span> Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-gray-600"></span> Locked
              </span>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="absolute bottom-6 right-2 text-[9px] text-gray-500">
            {isExpanded ? 'Drag to rotate • Scroll to zoom' : 'Press M to toggle'}
          </div>
        </div>
      )}
    </div>
  );
}
