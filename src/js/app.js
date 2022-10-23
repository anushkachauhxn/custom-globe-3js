import * as THREE from "three";

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Scene + Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 10);

// Texture Loader
const loader = new THREE.TextureLoader();

// Add Objects
// 1. Sphere
const sphereGeo = new THREE.SphereGeometry(5, 50, 50);
const sphereMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphere);

// Animate
(function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
})();
