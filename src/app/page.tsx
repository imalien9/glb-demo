"use client"

import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';

import { Object3D, Mesh } from 'three';
function isMesh(obj: Object3D): obj is Mesh {
  return 'isMesh' in obj && obj.isMesh === true;
}

import * as THREE from 'three';
// import { Material, Color } from 'three';
// function setColor(material: Material | Material[], color: Color) {
//   if (Array.isArray(material)) {
//     material.forEach(m => m.color.copy(color));
//   } else {
//     material.color.copy(color);
//   }
// }

// 定義顏色選項
const colorOptions = {
  original: 0xffffff, // 原始顏色
  red: 0xff0000,
  yellow: 0xffff00,
  blue: 0x0000ff,
};
interface AnimatedModelProps {
  color: number | string | null;
}
function AnimatedModel({ color }: AnimatedModelProps) {
  const group = useRef(null);
  const { scene, animations } = useGLTF('/animated_model.glb'); // 替換為您的 GLB 檔案路徑
  const { actions } = useAnimations(animations, scene);

  // 播放動畫
  useEffect(() => {
    const animationNames = Object.keys(actions);
    if (animationNames.length > 0) {
      actions[animationNames[0]]?.play();
    }
  }, [actions]);

  // 更新模型顏色
  useEffect(() => {
    scene.traverse((child) => {
      if (isMesh(child)) {
        console.log(child.name);
        const material = child.material as THREE.Material;
        if (color) {
          material.color.set(color); // 設置為指定顏色
        } else {
          // material.color.set(child.material.originalColor || child.material.color); // 恢復原始顏色
        }
      }
    });
  }, [color, scene]);

  return (
    <group ref={group} position={[0, 0, 0]} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

export default function Home() {
  const [selectedColor, setSelectedColor] = useState<number | null>(null); // 預設為原始顏色

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <ambientLight intensity={1.0} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <AnimatedModel color={selectedColor} />
        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>

      {/* 顏色選擇介面 */}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
        <button onClick={() => setSelectedColor(colorOptions.original)}>原始</button>
        <button onClick={() => setSelectedColor(colorOptions.red)}>紅色</button>
        <button onClick={() => setSelectedColor(colorOptions.yellow)}>黃色</button>
        <button onClick={() => setSelectedColor(colorOptions.blue)}>藍色</button>
      </div>
    </div>
  );
}