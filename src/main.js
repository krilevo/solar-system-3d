import './style.css';
import * as three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene, Camera, Renderer
const scene = new three.Scene();
const camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new three.WebGLRenderer({
  canvas: document.querySelector('#canvas'),
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const spaceTexture = new three.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Sun
const sunTexture = new three.TextureLoader().load('sun.jpg');
const sunMaterial = new three.MeshStandardMaterial({ 
  map: sunTexture, 
  emissive: 0xffaa33,
  emissiveIntensity: 0.8
});
const sun = new three.Mesh(new three.SphereGeometry(4, 64, 64), sunMaterial);

scene.add(sun);

// Stars
const starsGeometry = new three.BufferGeometry();
const starsMaterial = new three.PointsMaterial({ color: 0xffffff });
const starsVertices = [];

for (let i = 0; i < 100; i++) {
  const x = (Math.random() - 0.5) * 500;
  const y = (Math.random() - 0.5) * 500;
  const z = (Math.random() - 0.5) * 500;
  starsVertices.push(x, y, z);
}

starsGeometry.setAttribute('position', new three.Float32BufferAttribute(starsVertices, 3));
const stars = new three.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Function to create planets
const createPlanet = (size, texturePath, distance, speed) => {
  const texture = new three.TextureLoader().load(texturePath);
  const planet = new three.Mesh(
    new three.SphereGeometry(size, 32, 32),
    new three.MeshStandardMaterial({ map: texture })
  );
  planet.userData = { distance, speed };
  scene.add(planet);
  return planet;
};

// Planets
const mercury = createPlanet(0.3, 'mercury.png', 5, 0.002);
const venus = createPlanet(0.8, 'venus.jpg', 8, 0.0015);
const earth = createPlanet(1, 'earth.jpg', 11, 0.001);
const mars = createPlanet(0.6, 'mars.png', 15, 0.0008);
const jupiter = createPlanet(2.5, 'jupiter.jpg', 25, 0.0004);
const saturn = createPlanet(2, 'saturn.jpg', 35, 0.0003);
const uranus = createPlanet(1.5, 'uranus.jpg', 45, 0.0002);
const neptune = createPlanet(1.4, 'neptune.jpg', 55, 0.00015);

// Moon orbiting Earth
const moonTexture = new three.TextureLoader().load('moon.jpg');
const moon = new three.Mesh(
  new three.SphereGeometry(0.3, 32, 32),
  new three.MeshStandardMaterial({ map: moonTexture })
);
scene.add(moon);

// Saturn Rings
const ringTexture = new three.TextureLoader().load('saturn_ring.png');
const saturnRings = new three.Mesh(
  new three.TorusGeometry(3, 0.3, 2, 100),
  new three.MeshStandardMaterial({ map: ringTexture, side: three.DoubleSide, transparent: true })
);
saturnRings.rotation.x = Math.PI / 2;
saturn.add(saturnRings);

// Light source (Sun)
const light = new three.PointLight(0xffffff, 100, 100, 0.8);
light.position.set(0, 0, 0);
scene.add(light);

// Ambient light
const ambientLight = new three.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
camera.position.z = 60;

// Animation Loop
const animate = function () {
  requestAnimationFrame(animate);

  // Planets' orbital movement
  [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune].forEach(planet => {
    const time = Date.now() * planet.userData.speed;
    planet.position.x = planet.userData.distance * Math.cos(time);
    planet.position.z = planet.userData.distance * Math.sin(time);
  });

  // Moon orbit around Earth
  const moonTime = Date.now() * 0.002;
  moon.position.x = earth.position.x + 1.5 * Math.cos(moonTime);
  moon.position.z = earth.position.z + 1.5 * Math.sin(moonTime);

  renderer.render(scene, camera);
};

animate();
