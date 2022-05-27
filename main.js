import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
//import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


//debug controls!
//const gui = new dat.GUI()


/*
 * SETUP
 */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); //FFE8DC

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 20000);
//scene.add(camera);
camera.position.set(-19, 21, 37);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#main-content'),
  alpha: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild( renderer.domElement );
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);


/*
 * LIGHTS
 */
const targetObject = new THREE.Object3D();
const originTarget = new THREE.Object3D();
targetObject.position.set(-420,-500,400);
scene.add(targetObject, originTarget);

//const pointLight = new THREE.PointLight(0xbf40BF, .1);
const directionalLight = new THREE.DirectionalLight(0xffeba1, 1);
//directionalLight.target = targetObject;
directionalLight.castShadow = true;
directionalLight.target = targetObject;
//scene.add(directionalLight);
//pointLight.position.set(0, 13, -10);


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

// const crystal = new THREE.Mesh(crystalGeometry, shinyMaterial);
// const crystal2 = crystal.clone(); //this one is pretty useful!!
// crystal2.position.set(0, -4, 0);

// scene.add(crystal, crystal2);

// const toonBoxTest = new THREE.SphereGeometry(3,10);
// var toonSphereMat = new THREE.MeshToonMaterial();
// const toonMesh = new THREE.Mesh(toonBoxTest, toonSphereMat);
// scene.add(toonMesh);


/*
 * MAIN SHIP
 */
// const shipNormalMap = textureLoader.load('/assets/ship/Textures/StarSparrowRedUnified_001_normal.png');
// const shipColorMap = textureLoader.load('/assets/ship/Textures/StarSparrowRedUnified_001_baseColor.png');
// const shipEmissiveMap = textureLoader.load('/assets/ship/Textures/StarSparrowRedUnified_001_emissive.png');
// const shipMetallicMap = textureLoader.load('/assets/ship/Textures/StarSparrowRedUnified_001_emissive.png');
const gltfLoader = new GLTFLoader();
gltfLoader.load('/assets/ship/supership.gltf', (gltfScene) => {
  gltfScene.scene.position.set(0,8,0);
  //gltfScene.scene.scale.set(2,2,2);
  // const shipModel = gltfScene.scene;
  // var shipToonMat = new THREE.MeshToonMaterial({
  //   transparent: true,
  //   opacity: 0.3,
  //   map: shipColorMap,
  //   normalMap: shipNormalMap,
  //   emissiveMap: shipEmissiveMap,
  // });
  gltfScene.scene.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow= true;
    };
  });
  scene.add(gltfScene.scene);
});

const gltfLoader2 = new GLTFLoader();
gltfLoader2.load('/assets/asteroid/flatAsteroidTangled.gltf', (gltfScene) => {
  gltfScene.scene.position.set(-12,3,17);
  gltfScene.scene.scale.set(.2,.2,.2);
  gltfScene.scene.rotateY(-100);


  gltfScene.scene.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow= true;
    };
  });

  scene.add(gltfScene.scene);
});

// const gltfLoader3 = new GLTFLoader();
// gltfLoader3.load('/assets/saturn/scene.gltf', (gltfScene) => {
//   gltfScene.scene.position.set(-420,50,-1000);

//   scene.add(gltfScene.scene);
// });
const gltfLoader3 = new GLTFLoader();
gltfLoader3.load('/assets/planet/saturn.gltf', (gltfScene) => {
  gltfScene.scene.position.set(-420,50,-666);
  gltfScene.scene.scale.set(420,420,420);

  gltfScene.scene.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
    };
  });

  scene.add(gltfScene.scene);
});


//STARS
// function addStar() {
//   const geometry = new THREE.OctahedronGeometry(0.25);
//   const material = new THREE.MeshStandardMaterial({color: 0xffffff});
//   const starMesh = new THREE.Mesh(geometry, material);
//   starMesh.scale.setY(2.4)

//   const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(240));
//   starMesh.position.set(x, y, z);
//   scene.add(starMesh)
// }
// Array(240).fill().forEach(addStar);


//SHENANIGANS WITH LIGHTS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const sunLight = new THREE.SpotLight(0xffeba1);
sunLight.castShadow = true;
sunLight.angle = .2;
//sunLight.position.set(1337, 1337, -2337)
sunLight.position.set(102, 242, -320);
sunLight.shadow.camera.far = 1000;
sunLight.target = originTarget;

scene.add(sunLight);

const sunLight2 = new THREE.SpotLight(0xffeba1);
sunLight2.distance = 3200;
sunLight2.castShadow = true;
sunLight2.angle = .5;
sunLight2.position.set(1337, 1337, -2337);
sunLight2.shadow.camera.far = 400;
sunLight2.target = originTarget;

scene.add(sunLight2);


const sunGeometry = new THREE.SphereGeometry(4,24);
var toonSphereMat = new THREE.MeshBasicMaterial(0xffa600);
const toonMesh = new THREE.Mesh(sunGeometry, toonSphereMat);
toonMesh.scale.set(4,4,4);
toonMesh.position.set(1338, 1170, -2420);
scene.add(toonMesh);


/*
 * VIEWPORT SCALING
 */
const viewportSize = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener('resize', () => {
  viewportSize.width = window.innerWidth;
  viewportSize.height = window.innerHeight;

  camera.aspect = viewportSize.width / viewportSize.height;
  camera.updateProjectionMatrix();

  renderer.setSize(viewportSize.width, viewportSize.height);
  renderer.setPixelRatio(Map.min(window.devicePixelRatio, 2));
});


/*
 * HELPERS
 */
// const pointLightHelper = new THREE.PointLightHelper(pointLight);
const spotLightHelper = new THREE.SpotLightHelper(sunLight2);
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
//scene.add(spotLightHelper);
const helper = new THREE.CameraHelper( sunLight2.shadow.camera );
//scene.add( helper );
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper);



//CAM MOVEMENT
// function moveCamera() {
//   const distanceToTopOfPage = document.body.getBoundingClientRect().top;

//   //Distance to top is always negative, which is why multiply with negatives as well
//   camera.position.z = distanceToTopOfPage * -0.01;
//   camera.position.x = distanceToTopOfPage * -0.0002;
//   camera.position.y = distanceToTopOfPage * -0.0002;
// }
// document.body.onscroll = moveCamera();


const clock = new THREE.Clock();

function tick(){
  //update with elapsed time to mimic delta second action
  const elapsedTime = clock.getElapsedTime()


  requestAnimationFrame( tick );
  //moveCamera();


  renderer.render(scene, camera);
}
tick();