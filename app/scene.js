import THREE from 'three';
import axis from './Debug/axis';

/**
 *  THREEjs initialization
 *  ----------------------
 *  create camera, controls, scene and renderer
 */
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer();
// create mouse controls
let controls = new (require('three-orbit-controls')(THREE))(camera);
// initial camera position
camera.position.z = 900;
// set renderer fullscreen
renderer.setSize(window.innerWidth, window.innerHeight);
// add to dom
document.getElementById('scene').appendChild(renderer.domElement);

/**
 *  Lighting
 *  --------
 *  point light adds more direct lighting - color, intensity, distance, decay
 *  while ambient light adds light to all angles - color
 */
let pointLight = new THREE.PointLight(0xFFFFFF, 1, 0, 2);
let ambientLight = new THREE.AmbientLight(0x404040);
// set where you want the light to be directed at
pointLight.position.set(10, 50, 130);

/**
 *  Sphere
 *  ------
 *  radius dictates size, segments and rings dictates polygon count
 *  while ambient light adds light to all angles
 */
let sphereColors = [{r:156,g:0,b:253},{r:0,g:255,b:249},{r:0,g:253,b:40},{r:245,g:253,b:0},{r:252,g:15,b:145}];
let activeColor = 0;
let sphereRadius = 150;
let sphereSegments = 24;
let sphereRings = 24;
let sphereMaterial = new THREE.MeshLambertMaterial({
  color: 0xCC0000
});
let sphereGeometry = new THREE.SphereGeometry(sphereRadius, sphereSegments, sphereRings);
let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);


/**
 *  Plane
 *  ------
 *  pointlight adds more direct lighting
 *  while ambient light adds light to all angles
 */
let planePoints = 15;
let planeMaterial = new THREE.MeshLambertMaterial({
  color: 0x8a8a8a,
  side: THREE.DoubleSide,
  wireframe: true,
  wireframeLinewidth: 1
});
let planeGeometry = new THREE.PlaneGeometry(500, 500, planePoints, planePoints);
let plane = new THREE.Mesh(planeGeometry, planeMaterial);
// let the renderer know we plan to update the vertices
plane.geometry.verticesNeedUpdate = true;
plane.geometry.dynamic = true;
// rotate and position plane on ground
plane.position.y = -200;
plane.rotation.x = -Math.PI/2;

// add all objects to scene
scene.add(ambientLight);
scene.add(pointLight);
scene.add(sphere);
scene.add(plane);
// debug x,y,z axis
scene.add(axis(300));

// will fire every time new audio data is recieved
export default function(audioData) {
  let {levels, waveform, beatCutOff, isBeat, volume} = audioData;

  // change sphere color every beat
  if (isBeat) {
    let color = sphereColors[activeColor];
    sphere.material.color = new THREE.Color(`rgb(${color.r},${color.g},${color.b})`);
    activeColor = activeColor < sphereColors.length - 1 ? activeColor + 1 : 0;
  }

  // change sphere size based on volume
  sphere.scale.x = .3 + (volume / 2);
  sphere.scale.y = .3 + (volume / 2);
  sphere.scale.z = .3 + (volume / 2);

  waveform.forEach((value, i) => {
    if (i%2 === 0) {
      plane.geometry.vertices[i/2].z = value * 80;
    }
  });
  plane.geometry.verticesNeedUpdate = true;

  // rerender scene every update
  renderer.render(scene, camera);
}
