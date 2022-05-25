import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
//import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


/*
 * SETUP
 */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFE8DC);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.setZ(20);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#main-content'),
  alpha: true
});
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild( renderer.domElement );
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);


/*
 * LIGHTS
 */
const pointLight = new THREE.PointLight(0xbf40BF, 7);
scene.add(pointLight);
pointLight.position.set(0, 10, 0);


/*
 * PRACTICE ACTORS
 */
const crystalGeometry = new THREE.OctahedronGeometry(1, 0);

//DEMOMATERIAL
const shinyMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.1,
  roughness: 0.2,
  //shininess: 0.9,
  transparent: true, //transparency must be true for opacity to work
  opacity: 0.7
})


/*
 * TEXTURE STUDIES
 */
const textureLoader = new THREE.TextureLoader();
// const normalTexture = textureLoader.load('/normal-map.jpeg');
// const texturedMaterial = new THREE.MeshStandardMaterial({
//   color: 0xffffff,
//   metalness: 0.1,
//   roughness: 0.2,
//   normalMap: normalTexture,
//   emissive: 0x9152cc
// });

const crystal = new THREE.Mesh(crystalGeometry, shinyMaterial);
const crystal2 = crystal.clone(); //this one is pretty useful!!
crystal2.position.set(0, -4, 0);

scene.add(crystal, crystal2);

const toonBoxTest = new THREE.SphereGeometry(3,10);
var toonSphereMat = new THREE.MeshToonMaterial();
const toonMesh = new THREE.Mesh(toonBoxTest, toonSphereMat);
scene.add(toonMesh);


// const shipNormalMap = textureLoader.load('/assets/ship/Textures/StarSparrowRedUnified_001_normal.png');
// const shipColorMap = textureLoader.load('/assets/ship/Textures/StarSparrowRedUnified_001_baseColor.png');
// const shipEmissiveMap = textureLoader.load('/assets/ship/Textures/StarSparrowRedUnified_001_emissive.png');
// const shipMetallicMap = textureLoader.load('/assets/ship/Textures/StarSparrowRedUnified_001_emissive.png');

const gltfLoader = new GLTFLoader();
gltfLoader.load('/assets/ship/scene.gltf', (gltfScene) => {
  gltfScene.scene.position.set(0,8,0);
  gltfScene.scene.scale.set(3,3,3);

  // const shipModel = gltfScene.scene;
  // var shipToonMat = new THREE.MeshToonMaterial({
  //   transparent: true,
  //   opacity: 0.3,
  //   map: shipColorMap,
  //   normalMap: shipNormalMap,
  //   emissiveMap: shipEmissiveMap,
  // });
  // shipModel.traverse((o) => {
  //   if (o.isMesh) o.material = shipToonMat;
  // })


  scene.add(gltfScene.scene);
});


const viewportSize = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  viewportSize.width = window.innerWidth
  viewportSize.height = window.innerHeight

  camera.aspect = viewportSize.width / viewportSize.height
  camera.updateProjectionMatrix()

  renderer.setSize(viewportSize.width, viewportSize.height)
  renderer.setPixelRatio(Map.min(window.devicePixelRatio, 2))
})


/*
 * HELPERS
 */
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);


const clock = new THREE.Clock();

function tick(){
  //update with elapsed time to mimic delta second action
  const elapsedTime = clock.getElapsedTime()


  requestAnimationFrame( tick );


  renderer.render(scene, camera);
}
tick();