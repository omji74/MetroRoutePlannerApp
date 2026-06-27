import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LINE_CONFIG } from "../data/metroGraph";

export default function MetroScene3D({ result }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create Scene & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000814, 0.035);

    // Create Camera
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
    camera.position.set(0, 8, 18);
    camera.lookAt(0, 0, 0);

    // Lights
    const ambient = new THREE.AmbientLight(0x1a2a4a, 1.5);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x4488ff, 2);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight1 = new THREE.PointLight(0x0054a6, 3, 30);
    pointLight1.position.set(-8, 5, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xe8192c, 3, 30);
    pointLight2.position.set(8, 5, 0);
    scene.add(pointLight2);

    // Ground Grid Helper
    const gridHelper = new THREE.GridHelper(60, 40, 0x0a1628, 0x0a1628);
    scene.add(gridHelper);

    // Glossy Ground Plane
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x020810,
      metalness: 0.8,
      roughness: 0.3,
      transparent: true,
      opacity: 0.9,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Track Bed
    const trackGeo = new THREE.BoxGeometry(30, 0.08, 0.3);
    const trackMat = new THREE.MeshStandardMaterial({ color: 0x1a2a3a, metalness: 0.9, roughness: 0.2 });
    const track = new THREE.Mesh(trackGeo, trackMat);
    track.position.y = 2;
    scene.add(track);

    // Track Rails
    [-0.12, 0.12].forEach((z) => {
      const railGeo = new THREE.BoxGeometry(30, 0.05, 0.05);
      const railMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 1, roughness: 0.1 });
      const rail = new THREE.Mesh(railGeo, railMat);
      rail.position.set(0, 2.07, z);
      scene.add(rail);
    });

    // Elevated Track Pillars
    for (let x = -14; x <= 14; x += 4) {
      const pillarGeo = new THREE.BoxGeometry(0.2, 2, 0.2);
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x0d1b2a, metalness: 0.7, roughness: 0.4 });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(x, 1, 0);
      pillar.castShadow = true;
      scene.add(pillar);
    }

    // Side Buildings (glow)
    const stationColors = [0x0d2137, 0x0a1c2e, 0x081525];
    for (let i = -3; i <= 3; i++) {
      [-4.5, 4.5].forEach((side) => {
        const h = 1.5 + Math.random() * 2;
        const geo = new THREE.BoxGeometry(1.2, h, 1.2);
        const mat = new THREE.MeshStandardMaterial({
          color: stationColors[Math.abs(i) % 3],
          metalness: 0.6,
          roughness: 0.5,
          transparent: true,
          opacity: 0.8,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(i * 3.5, h / 2, side);
        mesh.castShadow = true;
        scene.add(mesh);

        // Window Glow
        const winGeo = new THREE.PlaneGeometry(0.8, 0.3);
        const winMat = new THREE.MeshBasicMaterial({ color: 0x4488cc, transparent: true, opacity: 0.6 });
        const win = new THREE.Mesh(winGeo, winMat);
        win.position.set(i * 3.5 + (side > 0 ? -0.61 : 0.61), h / 2, side);
        win.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
        scene.add(win);
      });
    }

    // Train Group
    const trainGroup = new THREE.Group();
    const trainColor = result && result.segments && result.segments.length > 0
      ? LINE_CONFIG[result.segments[0].line]?.hex || 0x0054a6
      : 0x0054a6;

    // Train Cars
    [-1.6, 0, 1.6].forEach((x, i) => {
      const carGeo = new THREE.BoxGeometry(1.4, 0.7, 0.55);
      const carMat = new THREE.MeshStandardMaterial({
        color: trainColor,
        metalness: 0.8,
        roughness: 0.2,
      });
      const car = new THREE.Mesh(carGeo, carMat);
      car.position.set(x, 0, 0);
      car.castShadow = true;
      trainGroup.add(car);

      // Windows
      const winGeo = new THREE.PlaneGeometry(0.8, 0.25);
      const winMat = new THREE.MeshBasicMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.7,
      });
      [0.28, -0.28].forEach((z) => {
        const win = new THREE.Mesh(winGeo, winMat);
        win.position.set(x, 0.05, z);
        win.rotation.y = z > 0 ? 0 : Math.PI;
        trainGroup.add(win);
      });

      // Headlight (front car only)
      if (i === 0) {
        const light = new THREE.PointLight(0xffffff, 2, 5);
        light.position.set(x - 0.72, 0, 0);
        trainGroup.add(light);

        const headGeo = new THREE.SphereGeometry(0.06, 8, 8);
        const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.set(x - 0.72, 0, 0);
        trainGroup.add(head);
      }
    });

    trainGroup.position.set(-16, 2.4, 0);
    scene.add(trainGroup);

    // Floating Station Signs
    const stationsToShow = result ? result.path.slice(0, 8) : ["Rajiv Chowk", "Kashmere Gate", "Sikanderpur"];
    stationsToShow.slice(0, 6).forEach((name, idx) => {
      const cvs = document.createElement("canvas");
      cvs.width = 256;
      cvs.height = 64;
      const ctx = cvs.getContext("2d");
      ctx.fillStyle = "rgba(0, 20, 50, 0.9)";
      
      // Use roundRect if supported, otherwise rect
      if (ctx.roundRect) {
        ctx.roundRect(2, 2, 252, 60, 8);
      } else {
        ctx.rect(2, 2, 252, 60);
      }
      ctx.fill();

      ctx.strokeStyle = "#0054a6";
      ctx.lineWidth = 2;
      if (ctx.roundRect) {
        ctx.roundRect(2, 2, 252, 60, 8);
      } else {
        ctx.rect(2, 2, 252, 60);
      }
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "center";
      ctx.fillText(name.slice(0, 20), 128, 38);

      const tex = new THREE.CanvasTexture(cvs);
      const geo = new THREE.PlaneGeometry(3, 0.75);
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
      const sign = new THREE.Mesh(geo, mat);
      sign.position.set(-7.5 + idx * 3, 5.5 + Math.sin(idx) * 0.3, -1.5);
      sign.rotation.x = -0.1;
      scene.add(sign);
      sign._floatOffset = idx;
    });

    // Particle system (floating dots)
    const particleCount = 300;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const partMat = new THREE.PointsMaterial({ color: 0x0054a6, size: 0.06, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // Animation Loop
    let trainX = -16;
    let t = 0;
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.016;

      // Train movement
      trainX += 0.06;
      if (trainX > 16) trainX = -16;
      trainGroup.position.x = trainX;
      trainGroup.rotation.z = Math.sin(t * 3) * 0.01; // sway

      // Camera orbital path
      camera.position.x = Math.sin(t * 0.08) * 6;
      camera.position.z = 18 + Math.cos(t * 0.05) * 2;
      camera.position.y = 8 + Math.sin(t * 0.07) * 1;
      camera.lookAt(0, 2, 0);

      // Float signs
      scene.children.forEach((obj) => {
        if (obj._floatOffset !== undefined) {
          obj.position.y = 5.5 + Math.sin(t + obj._floatOffset) * 0.2;
        }
      });

      // Pulse lights
      pointLight1.intensity = 3 + Math.sin(t * 2) * 0.5;
      pointLight2.intensity = 3 + Math.cos(t * 2) * 0.5;

      // Particle rotation
      particles.rotation.y += 0.001;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [result]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        borderRadius: "0 0 16px 16px",
      }}
    />
  );
}