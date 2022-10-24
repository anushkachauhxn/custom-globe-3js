import * as THREE from "three";
import gsap from "gsap";
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

// Group
const group = new THREE.Group();
group.add(sphere);
scene.add(group);

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

// Mouse Coordinates - (Normalized)
const mouse = {
  x: undefined,
  y: undefined,
};

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
  console.log(mouse);
});

// Animate
(function animate() {
  // Primary Spin Effect: simple rotation
  sphere.rotation.y += 0.003;

  // Secondary Spin Effect: from mouse movement
  // group.rotation.y = mouse.x * 0.5;
  gsap.to(group.rotation, {
    duration: 2,
    x: -mouse.y * 0.3,
    y: mouse.x * 0.5,
  });

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
})();
