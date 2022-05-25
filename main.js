import './style.css'
import * as THREE from 'three';



const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFE8DC);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(20);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#main-content')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//DEMO/PRACTICE ACTORS:
const pointLight = new THREE.PointLight(0xbf40BF);
scene.add(pointLight);

const crystalGeometry = new THREE.OctahedronGeometry(1, 0);

//DEMOMATERIAL
const shinyMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.1,
  roughness: 0.2,
  shininess: 0.9,
  transparent: true, //transparency must be true for opacity to work
  opacity: 0.7
})

/*
 * TEXTURE STUDIES
 */
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('/normal-map.jpeg');
const texturedMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.1,
  roughness: 0.2,
  normalMap: normalTexture,
  emissive: 0x9152cc
});



const crystal = new THREE.Mesh(crystalGeometry, shinyMaterial);
const crystal2 = crystal.clone(); //this one is pretty useful!!
crystal2.position.set(0, -4, 0);

scene.add(crystal, crystal2);





const clock = new THREE.Clock();

function tick(){
  //update with elapsed time to mimic delta second action
  const elapsedTime = clock.getElapsedTime()


  requestAnimationFrame( tick );


  renderer.render(scene, camera);
}
tick();