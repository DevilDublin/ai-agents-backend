// bg.js — smooth futuristic circuit background
import * as THREE from 'three';

export const initBackground = () => {
  const canvas = document.getElementById('background');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3
  });

  // Create circuit lines
  for (let i = 0; i < 70; i++) {
    const points = [];
    for (let j = 0; j < 5; j++) {
      points.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 120,
          (Math.random() - 0.5) * 100
        )
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    group.add(line);
  }

  // Add glow pulse
  const glowMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const glowSphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), glowMaterial);
  scene.add(group, glowSphere);
  camera.position.z = 80;

  function animate(time) {
    requestAnimationFrame(animate);
    const t = time * 0.0002;
    group.rotation.x = t * 0.3;
    group.rotation.y = t * 0.2;
    glowSphere.position.x = Math.sin(t * 4) * 30;
    glowSphere.position.y = Math.cos(t * 3) * 20;
    glowSphere.material.opacity = 0.5 + Math.sin(t * 4) * 0.5;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};
