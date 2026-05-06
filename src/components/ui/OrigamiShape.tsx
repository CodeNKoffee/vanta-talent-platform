import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface Props {
  type?: 'deer' | 'triangle' | 'exclamation';
  className?: string;
  style?: React.CSSProperties;
  color?: number;
  emissive?: number;
  rotationSpeed?: number;
}

export function OrigamiShape({ 
  type = 'deer', 
  className, 
  style, 
  color = 0x9b8dff, 
  emissive = 0x201040,
  rotationSpeed = 1 
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    
    if (type === 'deer') {
      camera.position.z = 12;
      camera.position.y = 1;
    } else {
      camera.position.z = 5;
    }

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    // Lower internal resolution, scale via CSS for performance
    renderer.setSize(400, 400);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mountRef.current.appendChild(renderer.domElement);

    let geometry: THREE.BufferGeometry;

    if (type === 'deer') {
      geometry = new THREE.BufferGeometry();
      const v = {
        nose: [0, -1, 3],
        leftEye: [-1.2, 1, 1],
        rightEye: [1.2, 1, 1],
        topHead: [0, 2.5, -0.5],
        jaw: [0, -1.5, 1],
        leftEarBase: [-2, 2.5, -1],
        rightEarBase: [2, 2.5, -1],
        leftAntlerTip: [-3.5, 5.5, 0],
        rightAntlerTip: [3.5, 5.5, 0],
      };

      const vertices = new Float32Array([
        ...v.nose, ...v.topHead, ...v.leftEye,
        ...v.nose, ...v.rightEye, ...v.topHead,
        ...v.nose, ...v.leftEye, ...v.jaw,
        ...v.nose, ...v.jaw, ...v.rightEye,
        ...v.leftEye, ...v.topHead, ...v.rightEye,
        ...v.leftEye, ...v.leftEarBase, ...v.topHead,
        ...v.rightEye, ...v.topHead, ...v.rightEarBase,
        ...v.leftEarBase, ...v.leftAntlerTip, ...v.topHead,
        ...v.rightEarBase, ...v.rightAntlerTip, ...v.topHead,
        ...v.leftEarBase, ...v.topHead, ...v.rightEarBase,
      ]);
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.computeVertexNormals();
    } else {
      // 3-sided cone = Tetrahedron pointing up
      geometry = new THREE.ConeGeometry(1.5, 2.5, 3);
      // Rotate to match the Vanta logo (flat side down, pointing up)
      geometry.rotateY(-Math.PI / 6);
    }

    // Material
    const material = new THREE.MeshStandardMaterial({
      color,
      emissive,
      roughness: 0.3,
      metalness: 0.2,
      flatShading: true,
      side: THREE.DoubleSide
    });

    const group = new THREE.Group();

    if (type === 'exclamation') {
      const topGeo = new THREE.ConeGeometry(0.6, 2.5, 4);
      topGeo.translate(0, 0.8, 0);
      const topMesh = new THREE.Mesh(topGeo, material);
      
      const dotGeo = new THREE.OctahedronGeometry(0.5, 0);
      dotGeo.translate(0, -1.2, 0);
      const dotMesh = new THREE.Mesh(dotGeo, material);
      
      group.add(topMesh);
      group.add(dotMesh);
    } else {
      const mesh = new THREE.Mesh(geometry, material);
      group.add(mesh);
    }
    
    scene.add(group);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe9d5ff, 1.5);
    dirLight2.position.set(-5, 3, -5);
    scene.add(dirLight2);

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime() * rotationSpeed;

      if (type === 'deer') {
        group.rotation.y = Math.sin(time * 0.4) * 0.6;
        group.rotation.x = Math.sin(time * 0.7) * 0.15 - 0.1;
        group.rotation.z = Math.sin(time * 0.5) * 0.1;
        group.position.y = Math.sin(time * 1.5) * 0.2;
      } else if (type === 'exclamation') {
        group.rotation.y = time * 0.6;
        group.rotation.x = Math.sin(time * 1.2) * 0.1;
        group.position.y = Math.sin(time * 3) * 0.15;
      } else {
        // Triangle spinning slowly
        group.rotation.y = time * 0.8;
        group.position.y = Math.sin(time * 2) * 0.1;
      }

      renderer.render(scene, camera);
    };
    animate();

    const currentMount = mountRef.current;

    return () => {
      cancelAnimationFrame(animationId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [type, color, emissive, rotationSpeed]);

  return (
    <div 
      ref={mountRef} 
      className={className}
      style={{ 
        width: 400, 
        height: 400,
        pointerEvents: 'none',
        ...style
      }} 
      aria-hidden="true"
    />
  );
}
