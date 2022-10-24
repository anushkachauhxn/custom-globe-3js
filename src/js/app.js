import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import atmosphereVertexShader from "./shaders/atmosphereVertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphereFragment.glsl";
import globeTexture from "../assets/globe.jpg";

// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
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
camera.position.set(0, 0, 15);

// Texture Loader
const loader = new THREE.TextureLoader();

// Add Objects
// 1. Sphere
const sphereGeo = new THREE.SphereGeometry(5, 50, 50);
const sphereMat = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    globeTexture: { value: loader.load(globeTexture) },
  },
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphere);

// 2. Atmosphere = Another sphere slightly bigger than the globe
const atmosphereGeo = new THREE.SphereGeometry(5, 50, 50);
const atmosphereMat = new THREE.ShaderMaterial({
  vertexShader: atmosphereVertexShader,
  fragmentShader: atmosphereFragmentShader,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
});
const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
atmosphere.scale.set(1.1, 1.1, 1.1);
scene.add(atmosphere);

// Animate
(function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
})();
