// demos.js — orbital demo selector
import * as THREE from 'three';

export const initDemos = () => {
  const selectBtn = document.getElementById('selectDemoBtn');
  const orbitContainer = document.getElementById('orbitContainer');
  if (!selectBtn || !orbitContainer) return;

  selectBtn.addEventListener('click', () => {
    orbitContainer.innerHTML = '';
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, orbitContainer.clientWidth / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    orbitContainer.appendChild(renderer.domElement);
    renderer.setSize(orbitContainer.clientWidth, 400);

    const geometry = new THREE.IcosahedronGeometry(2, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0x7b61ff,
      emissive: 0x7b61ff,
      emissiveIntensity: 1
    });

    const bots = [];
    for (let i = 0; i < 6; i++) {
      const mesh = new THREE.Mesh(geometry, material.clone());
      mesh.position.set(
        Math.cos((i / 6) * Math.PI * 2) * 10,
        Math.sin((i / 6) * Math.PI * 2) * 5,
        0
      );
      scene.add(mesh);
      bots.push(mesh);
    }

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(0, 0, 20);
    scene.add(light);
    camera.position.z = 20;

    let rotationY = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      rotationY += 0.002;
      scene.rotation.y = rotationY;
      bots.forEach((b, i) => (b.rotation.y += 0.01 + i * 0.001));
      renderer.render(scene, camera);
    };
    animate();
  });
};
