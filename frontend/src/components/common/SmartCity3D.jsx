import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * High-performance, lightweight interactive 3D Smart City visualization.
 * Uses Three.js to render a futuristic smart city with procedural buildings,
 * glowing network routes, traffic pulses, and floating civic beacons.
 */
export default function SmartCity3D({ height = '100%', interactive = true }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b14, 0.022);

    const width = container.clientWidth || 400;
    const heightPx = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(16, 18, 22);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Group for the entire city
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(36, 36, 0x00f2fe, 0x16223d);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    // Materials
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x0c1527,
      roughness: 0.25,
      metalness: 0.85,
    });

    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });

    const glowingRoofMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: false,
    });

    const beaconColors = [0x00f2fe, 0x00d2b4, 0xf59e0b, 0x38bdf8];

    // Procedural Buildings
    const buildings = [];
    const gridSize = 6;
    const spacing = 3.6;

    for (let x = -gridSize / 2; x <= gridSize / 2; x++) {
      for (let z = -gridSize / 2; z <= gridSize / 2; z++) {
        // Skip some slots for roads & civic plazas
        if (Math.abs(x) === 1 || Math.abs(z) === 1) continue;
        if (Math.random() < 0.2) continue;

        const bHeight = 1.5 + Math.random() * 5.5 + (x === 0 && z === 0 ? 4 : 0);
        const geo = new THREE.BoxGeometry(2.2, bHeight, 2.2);
        const mesh = new THREE.Mesh(geo, buildingMat);
        mesh.position.set(x * spacing, bHeight / 2, z * spacing);
        cityGroup.add(mesh);

        // Edge wireframe for cybernetic outline
        const edges = new THREE.EdgesGeometry(geo);
        const line = new THREE.LineSegments(edges, edgeMat);
        line.position.copy(mesh.position);
        cityGroup.add(line);

        // Glowing roof marker on top of taller towers
        if (bHeight > 4) {
          const roofGeo = new THREE.BoxGeometry(2.0, 0.1, 2.0);
          const roof = new THREE.Mesh(roofGeo, glowingRoofMat);
          roof.position.set(x * spacing, bHeight + 0.05, z * spacing);
          cityGroup.add(roof);
        }

        buildings.push(mesh);
      }
    }

    // Civic Beacons (Pulsing floating markers)
    const beacons = [];
    const beaconCoords = [
      { x: 3.6, y: 5.5, z: 3.6, color: 0x00f2fe, label: 'Water' },
      { x: -7.2, y: 6.2, z: 7.2, color: 0x00d2b4, label: 'Resolved' },
      { x: 7.2, y: 4.8, z: -7.2, color: 0xf59e0b, label: 'Pothole' },
      { x: -3.6, y: 7.0, z: -3.6, color: 0x6366f1, label: 'Electricity' },
    ];

    beaconCoords.forEach((b) => {
      const beaconGroup = new THREE.Group();
      beaconGroup.position.set(b.x, b.y, b.z);

      // Core sphere
      const sphereGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color: b.color });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      beaconGroup.add(sphere);

      // Glowing pulse ring
      const ringGeo = new THREE.RingGeometry(0.5, 0.7, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: b.color, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      beaconGroup.add(ring);

      // Light beam to ground
      const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, b.y, 8);
      const beamMat = new THREE.MeshBasicMaterial({ color: b.color, transparent: true, opacity: 0.35 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = -b.y / 2;
      beaconGroup.add(beam);

      cityGroup.add(beaconGroup);
      beacons.push({ group: beaconGroup, ring, initialY: b.y });
    });

    // Moving Traffic / Data Particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleSpeeds = [];

    for (let i = 0; i < particleCount; i++) {
      const isXRoute = Math.random() > 0.5;
      const roadCoord = (Math.floor(Math.random() * 3) - 1) * spacing;
      const along = (Math.random() - 0.5) * 30;

      positions[i * 3] = isXRoute ? along : roadCoord;
      positions[i * 3 + 1] = 0.12;
      positions[i * 3 + 2] = isXRoute ? roadCoord : along;

      particleSpeeds.push({
        isXRoute,
        speed: (0.08 + Math.random() * 0.12) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.32,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0f2038, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.5);
    dirLight1.position.set(20, 30, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00d2b4, 1.5);
    dirLight2.position.set(-20, 20, -15);
    scene.add(dirLight2);

    // Mouse Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = mouseX * 0.45;
      targetRotationX = mouseY * 0.25;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Window Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth idle rotation + mouse damping
      cityGroup.rotation.y += (targetRotationY + elapsedTime * 0.04 - cityGroup.rotation.y) * 0.05;
      cityGroup.rotation.x += (targetRotationX * 0.5 - cityGroup.rotation.x) * 0.05;

      // Animate civic beacons
      beacons.forEach((b, index) => {
        b.group.position.y = b.initialY + Math.sin(elapsedTime * 2 + index) * 0.25;
        const scale = 1 + Math.sin(elapsedTime * 3 + index) * 0.25;
        b.ring.scale.set(scale, scale, scale);
      });

      // Animate traffic particles
      const pos = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const p = particleSpeeds[i];
        if (p.isXRoute) {
          pos[i * 3] += p.speed;
          if (pos[i * 3] > 18) pos[i * 3] = -18;
          if (pos[i * 3] < -18) pos[i * 3] = 18;
        } else {
          pos[i * 3 + 2] += p.speed;
          if (pos[i * 3 + 2] > 18) pos[i * 3 + 2] = -18;
          if (pos[i * 3 + 2] < -18) pos[i * 3 + 2] = 18;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      camera.lookAt(0, 2, 0);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      buildingMat.dispose();
      edgeMat.dispose();
      glowingRoofMat.dispose();
      particleMat.dispose();
      particleGeo.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height,
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: interactive ? 'auto' : 'none',
      }}
    />
  );
}
