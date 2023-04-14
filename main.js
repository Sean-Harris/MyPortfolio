import './style.css?parameter=1'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MathUtils } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GUI } from 'dat.gui';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Camera, SplineCurve, Vector3, Vector4 } from 'three';
import fShader from './fragmentShader.glsl.js'
import vShader from './vertexShader.glsl.js'



gsap.registerPlugin(ScrollTrigger);


var modelsLoaded = false;

var seanCenter = document.querySelector('#sean');
var seanNav = document.querySelector('.container');
const seanTitle = document.querySelector("#title");
const greeting = document.querySelector('#greeting');
const titleContainer = document.querySelector('#titleContainer');

(() => {
  const $triangles = document.querySelectorAll(".triangle");
  const template = `<svg class="triangle-svg" viewBox="0 0 140 141">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <polygon class="triangle-polygon"  points="70 6 136 138 4 138"></polygon>
    </g>
  </svg>`;

  Array.prototype.forEach.call($triangles, ($triangle, index) => {
    $triangle.innerHTML = template;
  });
})();

const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-nav');
hamburger.addEventListener('click', function(){
  this.classList.toggle('is-active');
  mobileMenu.classList.toggle('is-active');
  titleContainer.classList.toggle('hidden');
  if(seanTitle.classList.contains('hidden')){
    seanTitle.classList.toggle('hidden');
  }
  else{
    setTimeout(function(){
    seanTitle.classList.toggle('hidden');
  },360);
  }
})

const navbar = document.querySelector('.navb');

// var menuToggleButton = document.getElementById("menuToggle");
// var menuBar = gsap.timeline({paused: true});

// menuBar.to('.bar-top', 0.5,{
//   attr:{d: "M8,2 L2,8"},
//   x: 1,
//   ease: Power2.easeInOut,
// }, 'start');

// menuBar.to('.bar-center', 0.5,{
//   autoAlpha: 0,
// }, 'start');

// menuBar.to('.bar-bottom', 0.5,{
//   attr:{d: "M8,8 L2,2"},
//   x: 1,
//   ease: Power2.easeInOut,
// }, 'start');

// menuBar.reverse();

// var navTl = gsap.timeline({paused: true});

// //navTl.to();

// //navTl.reverse();

// menuToggleButton.addEventListener('click', function(){
//   menuBar.reversed(!menuBar.reversed());
//   //navTl.reversed(!navTl.reversed());
// })




const scrollProgress = document.getElementById('progressbar');
var height =
  document.documentElement.scrollHeight - document.documentElement.clientHeight;
window.addEventListener('scroll', () => {
  const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  scrollProgress.style.height = `${(scrollTop / height) * 100}%`;
});
const scrollProgressL = document.getElementById('progressbar2');
// var height =
//   document.documentElement.scrollHeight - document.documentElement.clientHeight;
window.addEventListener('scroll', () => {
  const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  scrollProgressL.style.height = `${(scrollTop / height) * 100}%`;
});

const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = function(url, item, total){
  console.log('started loading')
}
const loadingScreenContainer = document.querySelector('.loader-wrapper');
loadingManager.onLoad = function(url, item, total){
  loadingScreenContainer.style.display = 'none';
  modelsLoaded = true;
  init();

  
  setTimeout(function(){
    
  },6000);
}
loadingManager.onError = function(url){
  console.error('mathafakin fatal error')
}

//debug controls!
// const gui = new GUI();


/*
 * SETUP
 */
const scene = new THREE.Scene();

//SKYBOX
const skyMatArray = [];
const sb_ft = new THREE.TextureLoader().load('/assets/skybox/front.png');
const sb_bk = new THREE.TextureLoader().load('/assets/skybox/back.png');
const sb_up = new THREE.TextureLoader().load('/assets/skybox/top.png');
const sb_dn = new THREE.TextureLoader().load('/assets/skybox/bottom.png');
const sb_rt = new THREE.TextureLoader().load('/assets/skybox/right.png');
const sb_lf = new THREE.TextureLoader().load('/assets/skybox/left.png');

skyMatArray.push(new THREE.MeshBasicMaterial({map: sb_ft}));
skyMatArray.push(new THREE.MeshBasicMaterial({map: sb_bk}));
skyMatArray.push(new THREE.MeshBasicMaterial({map: sb_up}));
skyMatArray.push(new THREE.MeshBasicMaterial({map: sb_dn}));
skyMatArray.push(new THREE.MeshBasicMaterial({map: sb_rt}));
skyMatArray.push(new THREE.MeshBasicMaterial({map: sb_lf}));

for(let i=0;i<6;i++)
  skyMatArray[i].side = THREE.BackSide;

const skyboxInterstellar = new THREE.BoxGeometry(1000, 1000, 1000);
const skybox = new THREE.Mesh(skyboxInterstellar, skyMatArray);
scene.add(skybox);

scene.background = new THREE.Color(0x000000); //FFE8DC

const scene2 = new THREE.Scene();

//CAMERA!!!
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 700);
//camera.lookAt(66,40,35);
camera.position.set(0, 0, 6.3);

// const camGui = gui.addFolder('Camera');
// const camPos = camGui.addFolder('Position');

// camPos.add(camera.position, 'x').listen();
// camPos.add(camera.position, 'y').listen();
// camPos.add(camera.position, 'z').listen();


const renderer2 = new CSS3DRenderer({
  antialias: false,
  powerPreference: 'high-performance',
});
    renderer2.setSize( window.innerWidth, window.innerHeight );
    renderer2.domElement.style.position = 'fixed';
    renderer2.domElement.style.top = 0;
    document.querySelector('#css').appendChild( renderer2.domElement );


const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#main-content'),
  alpha: true,
  antialias: true,
  powerPreference: "high-performance"
});
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
renderer.setPixelRatio(window.devicePixelRatio );//* 0.75);
document.body.appendChild( renderer.domElement );
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);

//camera.lookAt(0,20,0);
/*
 * LIGHTS
 */
// const targetObject = new THREE.Object3D();
// const originTarget = new THREE.Object3D();
// targetObject.position.set(-420,-500,400);
// scene.add(targetObject, originTarget);

const pointLight = new THREE.PointLight(0x00ffff, 1);
pointLight.position.set(10,-9,-3);
pointLight.castShadow = false; // default false
const lightHelper = new THREE.PointLightHelper(pointLight);
const pointLight2 = new THREE.PointLight(0xe60944, 1);
pointLight2.position.set(-10,-32,0);
//const directionalLight = new THREE.DirectionalLight(0xffeba1, 1);
//directionalLight.target = targetObject;
//pointLight.castShadow = true;
//directionalLight.target = targetObject;
//scene.add(directionalLight);
//pointLight.position.set(0, 13, -10);
//const ambientLight = new THREE.AmbientLight(0xffffff,.1);
scene.add(pointLight);
scene.add(lightHelper);
scene.add(pointLight2);


// class ColorGUIHelper {
//   constructor(object, prop) {
//     this.object = object;
//     this.prop = prop;
//   }
//   get value() {
//     return `#${this.object[this.prop].getHexString()}`;
//   }
//   set value(hexString) {
//     this.object[this.prop].set(hexString);
//   }
// }

// const lightGui1 = gui.addFolder('Light1');
// lightGui1.add(pointLight.position, 'x');
// lightGui1.add(pointLight.position, 'y');
// lightGui1.add(pointLight.position, 'z');
// lightGui1.addColor(new ColorGUIHelper(pointLight, 'color'), 'value').name('color');
// lightGui1.add(pointLight, 'intensity');

// const lightGui2 = gui.addFolder('Light2');
// lightGui2.add(pointLight2.position, 'x')
// lightGui2.add(pointLight2.position, 'y')
// lightGui2.add(pointLight2.position, 'z')
// lightGui2.addColor(new ColorGUIHelper(pointLight2, 'color'), 'value').name('color');
// lightGui2.add(pointLight2, 'intensity');



/*
 * PRACTICE ACTORS
 */
// const crystalGeometry = new THREE.OctahedronGeometry(1, 0);

// //DEMOMATERIAL
// const shinyMaterial = new THREE.MeshStandardMaterial({
//   color: 0xffffff,
//   metalness: 0.1,
//   roughness: 0.2,
//   //shininess: 0.9,
//   transparent: true, //transparency must be true for opacity to work
//   opacity: 0.7
// })


/*
 * TEXTURE STUDIES
 */
//const textureLoader = new THREE.TextureLoader();
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


/*
 * VIEWPORT SCALING
 */

const fov = 65;
const planeAspectRatio = 16 / 9;


const viewportSize = {
  width: window.innerWidth,
  height: window.outerHeight//window.height//window.innerHeight
};


var titleRect = seanTitle.getBoundingClientRect();
var titleHeight = titleRect.height;
var titleWidth = titleRect.width;
var titleLeftPadding = parseFloat(window.getComputedStyle(navbar, null).getPropertyValue('padding-left'));
var navbarRect = navbar.getBoundingClientRect();
var navbarHeight = navbarRect.height;

var lastTitleTLprogress = 1.0;


window.addEventListener('resize', () => {
  viewportSize.width = window.innerWidth;
  viewportSize.height = window.innerHeight;

  height =
  document.documentElement.scrollHeight - document.documentElement.clientHeight;

  camera.aspect = viewportSize.width / viewportSize.height;
  camera.updateProjectionMatrix();
  renderer.setSize(viewportSize.width, viewportSize.height);
  renderer2.setSize(viewportSize.width, viewportSize.height);

  // if (camera.aspect > planeAspectRatio) {
	// 	// window too large
	// 	camera.fov = fov;
	// } else {
	// 	// window too narrow
	// 	const cameraHeight = Math.tan(MathUtils.degToRad(fov / 2));
	// 	const ratio = camera.aspect / planeAspectRatio;
	// 	const newCameraHeight = cameraHeight / ratio;
	// 	camera.fov = MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2;
	// }

  
  //renderer.setPixelRatio(Map.min(window.devicePixelRatio, 2));

  titleRect = seanTitle.getBoundingClientRect();
  titleHeight = titleRect.height;
  titleWidth = titleRect.width;
  titleLeftPadding = parseFloat(window.getComputedStyle(navbar, null).getPropertyValue('padding-left'));
  navbarRect = navbar.getBoundingClientRect();
  navbarHeight = navbarRect.height;

  createTitleTL();

  // ScrollTrigger.refresh();
});

// // create the dom Element
// var element = document.createElement( 'img' );
// element.src = 'PHseanPic.jpg';
// // create the object3d for this element
// var cssObject = new THREE.CSS3DObject( element );
// // we reference the same position and rotation 
// cssObject.position = planeMesh.position;
// cssObject.rotation = planeMesh.rotation;
// // add it to the css scene
// cssScene.add(cssObject);


// var cssRenderer = new CSS3DRenderer();
// cssRenderer.setSize( window.innerWidth, window.innerHeight );
// cssRenderer.domElement.style.position = 'fixed';
// cssRenderer.domElement.style.top = 0;

// var canvas1 = document.createElement('canvas'),
// ctx = canvas1.getContext('2d');
 
// canvas.width = 8;
// canvas.height = 8;
 
// ctx.fillStyle = '#000000';
// ctx.fillRect(0, 0, canvas1.width, canvas1.height);
// ctx.strokeStyle = '#ff00ff';
// ctx.strokeRect(0, 0, canvas1.width, canvas1.height);



// //const planeGeometry = new THREE.BoxGeometry(100,100,100);
// const planeMesh = new THREE.Mesh(planeGeometry, testTexture);

// scene.add(planeMesh);

// function load_home() {
//   document.getElementById("content").innerHTML='<object type="text/html" data="home.html" ></object>';
// }


//Profile picture:
const ProfilePicGeometry = new THREE.CircleGeometry( .1, 64 );
const ProfilePicMaterial = new THREE.TextureLoader().load('/PHseanPic.jpg');//new THREE.MeshBasicMaterial( { color: 0xffff00 } );
let circleMat = new THREE.MeshBasicMaterial({map: ProfilePicMaterial});
const ProfilePicCircle = new THREE.Mesh( ProfilePicGeometry, circleMat );
scene.add( ProfilePicCircle );
ProfilePicCircle.position.set(0,.1,5.85)

const threeTone = new THREE.TextureLoader().load('/assets/gradientMaps/threeTone.jpg')
threeTone.minFilter = THREE.NearestFilter
threeTone.magFilter = THREE.NearestFilter

// const fourTone = new THREE.TextureLoader().load('/assets/gradientMaps/fourTone.jpg')
// fourTone.minFilter = THREE.NearestFilter
// fourTone.magFilter = THREE.NearestFilter

// const fiveTone = new THREE.TextureLoader().load('/assets/gradientMaps/fiveTone.jpg')
// fiveTone.minFilter = THREE.NearestFilter
// fiveTone.magFilter = THREE.NearestFilter

const skellyMat = new THREE.MeshToonMaterial({
  gradientMap: threeTone,
  //normalMap: new THREE.TextureLoader().load('/assets/skellyClosed/textures/Skeleton_normal.png'),
  color: 0xffffff,
});

// const uniforms = {
//   time: {value: 0.0},
//   speed: {value: 18.0},
//   charSize: {value: {x:2.0, y:1.5}},
//   charResolution: {value: 7.0},
//   color: {value: new THREE.Color(0xFF0075)},
//   backgroundColor: {value: new Vector4(0,0,0.1,1)},
//   resolution: {value: {x:4.0, y:4.0}}
// };

const uniforms = {
  time: {value: 0.0},
  speed: {value: 8.0},
  charSize: {value: {x:20.0, y:10.5}},
  charResolution: {value: 4.0},
  color: {value: new THREE.Color(0xff002b)},
  backgroundColor: {value: new Vector4(0,0,0,1)},
  resolution: {value: {x:2.0, y:1.5}}
};

var digiMatHexColor = 0xFF0075;

// const uniforms2 = {
//   cameraPosition: {value: {x: 0, y:0, z:0}},
//   time: {value: 0.0},
//   color: {value: new THREE.Color(0xf0075c)},
//   lightPosition: {value: {x: 0, y:0, z:0}},
//   borderWidth: {value: 0.45},
//   toonNoise1: {value: new THREE.TextureLoader().load('/assets/skybox/top.png')},
//   toonNoise2: {value: new THREE.TextureLoader().load('/assets/skybox/top.png')},
// };

const digiMat = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vShader,
  fragmentShader: fShader
});

var keyMesh;

const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.load('/assets/key/scene.gltf', (gltfScene) => {
  // gltfScene.scene.scale.set(4,4,4);
  // gltfScene.scene.rotation.set(0,0,0); //0.785398 is 45 in rad
  // gltfScene.scene.position.set(0, -0.5, 0);
  gltfScene.scene.scale.set(.39,.39,.39);
  gltfScene.scene.rotation.set(0,0,0); //0.785398 is 45 in rad
  gltfScene.scene.position.set(0, 0.069, 3.62);
  keyMesh = gltfScene.scene;

  gltfScene.scene.traverse((o) => {
    if (o.isMesh) {
      o.material = digiMat;
      //o.castShadow = true;
      //o.receiveShadow= true;
    };
  });

  scene.add(gltfScene.scene);
});

var skellyHandOpen;
var skellyHandClosed;

const gltfLoader2 = new GLTFLoader(loadingManager);
gltfLoader2.load('/assets/skeleton/skellyArmUV.gltf', (gltfScene) => {
  gltfScene.scene.scale.set(5,5,5);
  gltfScene.scene.position.set(0.13, -35, -4);
  skellyHandOpen = gltfScene.scene;

  gltfScene.scene.traverse((o) => {
    if (o.isMesh) {
      o.material = skellyMat;
      //o.castShadow = true;
      //o.receiveShadow= true;
    };
  });

  scene.add(gltfScene.scene);
});

var mixer;
var flashModel;
var flashMat = new THREE.MeshBasicMaterial({
  color: 0xfcd303,
  transparent: true,
  opacity: 0.0,
});

var flashRotSpeed = 0.024;
var keyGlowMesh;

const gltfLoader3 = new GLTFLoader(loadingManager);
gltfLoader3.load('./assets/flash/scene.gltf', function(gltfScene) {
  //console.log('stroke my shaft ' + gltfScene);
  gltfScene.scene.scale.set(10,10,10);
  gltfScene.scene.position.set(0, -26, -6);
  flashModel = gltfScene.scene;
  // keyGlowMesh = flashModel.clone();
  // keyGlowMesh.position.set(-0.1,0,-20)

  //gltfScene.scene.parent = dubShitTestCube;
  //

  gltfScene.scene.traverse(function(o) {
    if (o.isMesh) {
      o.material = flashMat;
    };
  });
  // mixer = new THREE.AnimationMixer( keyGlowMesh );
  //       gltfScene.animations.forEach( ( clip ) => {
  //           mixer.clipAction( clip ).play();
  //       });
        scene.add(gltfScene.scene);
        //scene.add(keyGlowMesh)
});

const gltfLoader4 = new GLTFLoader(loadingManager);
gltfLoader4.load('./assets/skeleton/skellyFist.gltf', function(gltfScene) {
  gltfScene.scene.scale.set(5,5,5);
  gltfScene.scene.position.set(0.13, -35, -4);
  skellyHandClosed = gltfScene.scene;

  gltfScene.scene.traverse((o) => {
    if (o.isMesh) {
      //o.material = digiMat;
      o.material = skellyMat;
      //o.castShadow = true;
      //o.receiveShadow= true;
    };
  });
  scene.add(gltfScene.scene);
  gltfScene.scene.visible = false;
});

const TVgroup = new THREE.Group();
var tvMesh;
var tvMat;
const tvMats = new Set();

const gltfLoader5 = new GLTFLoader(loadingManager);
gltfLoader5.load('./assets/tv/TV2/tv2.gltf', function(gltfScene) {
  gltfScene.scene.scale.set(0.09,0.09,0.097);
  gltfScene.scene.rotation.set(0,-1.5708,0)
  gltfScene.scene.position.set(0, -0.3, 3);
  tvMesh = gltfScene.scene;
  //tvMat = gltfScene.scene.material;
  // gltfscene.parser.getDependencies( 'material' ).then( ( materials ) => {
  //   console.log( materials );
  // });

  

  gltfScene.scene.traverse((o) => {
    //if ( o.material ) tvMats.add( o.material );
    if ( o.material && o.material.name === 'Material_17' )
    o.material = digiMat; // tvMats.add( o.material );
    if ( o.material && o.material.name === 'Material_65' )
    o.material = new THREE.MeshBasicMaterial({
      //gradientMap: threeTone,
      color: 0x988D8D,
      //receiveShadow: true,
    })
    if (o.isMesh) {
      o.castShadow = true;
      // tvMesh = o;
      tvMat = o.material;
      //o.material = digiMat;
      //o.material = skellyMat;
    };
  });
  scene.add(gltfScene.scene);
  TVgroup.add(gltfScene.scene);
});



//var content = document.getElementById("css").innerHTML;

//ytplayerDivElement.id = 'screenDiv';
var ytplayerDivElement = document.createElement( 'div' )
        
ytplayerDivElement.innerHTML = '<object type="text/html" data="ScreenPage.html" ></object>'; //generic2wtf.html

var domObject = new CSS3DObject( ytplayerDivElement );
domObject.position.set(0,-0.14,3.5)
domObject.scale.set(.008,.008,.008)
scene2.add( domObject );
//TVgroup.add(domObject);

const whiteNoiseElement = document.getElementById("staticVid");
whiteNoiseElement.play();
var whiteNoiseTexture = new THREE.VideoTexture(whiteNoiseElement);
whiteNoiseTexture.minFilter = THREE.LinearFilter;
whiteNoiseTexture.magFilter = THREE.LinearFilter;

var whiteNoiseMaterial = new THREE.MeshBasicMaterial({
  map: whiteNoiseTexture,
  side: THREE.FrontSide,
  toneMapped: false,
  transparent: true,
  opacity: 1,
});

  var staticGeometry = new THREE.PlaneGeometry( 160, 103 );
  var staticMesh = new THREE.Mesh( staticGeometry, whiteNoiseMaterial );
  //staticMesh.position.copy( domObject.position );
  staticMesh.position.set(0,-0.14,3.5101)
  staticMesh.scale.copy(domObject.scale)
  // staticMesh.position.add(10,0,-1.01)
  staticMesh.rotation.copy( domObject.rotation );
  //mesh.scale.copy( domObject.scale );
  scene.add(staticMesh);
  TVgroup.add(staticMesh);


var material = new THREE.MeshPhongMaterial({
  opacity	: 0.1,
  color	: new THREE.Color('black'),
  blending: THREE.NoBlending,
  side	: THREE.DoubleSide,
});
var geometry = new THREE.PlaneGeometry( 160, 103 );
var mesh = new THREE.Mesh( geometry, material );
mesh.position.copy( domObject.position );
mesh.rotation.copy( domObject.rotation );
mesh.scale.copy( domObject.scale );
mesh.castShadow = false;
mesh.receiveShadow = true;
scene.add(mesh);
TVgroup.add(mesh);
domObject.position.set(0,0.86,3.5)

// gsap.defaults({overwrite: 'auto'});

// gsap.to(camera.position, {

//   scrollTrigger:
//   {

//     //trigger: renderer.domElement,
//     trigger: document.getElementById("main"),
//     start: 'top top',
//     end: 'bottom bottom',
//     //pin: true,
//     scrub: true,
//     //markers: true
//   },
//   x: 0,
//   y: -42,
//   z: 23, //used to be 33
//   ease: Power1.easeIn,
            
//   //onUpdate: function () {
//   //  camera.updateProjectionMatrix();
//   //}
// });
gsap.to(camera.position, {

  scrollTrigger:
  {

    //trigger: renderer.domElement,
    trigger: document.getElementById("baby"),
    start: 'bottom 40%',
    endTrigger: document.getElementById("main"),
    end: 'bottom bottom',
    //pin: true,
    scrub: true,
    //markers: true
  },
  x: 0,
  y: -41.87,
  z: 13,//23, //used to be 33
  ease: Power3.easeIn,
            
  //onUpdate: function () {
  //  camera.updateProjectionMatrix();
  //}
});

// ScrollTrigger.create({
//   start: 'bottom bottom',
//   trigger: '#baby',
//   endTrigger: 'main',
//   toggleClass: { targets: '.navb', className: 'is-active'},
//   // scrub: true,
//   // onEnter: titleToNav,
//   // onToggle: titleTL,
// });

// ScrollTrigger.create({
//   trigger: document.querySelector('#title'),
//   start: 'top 90%',//'bottom ' + navbarHeight + 'px',
//   // endTrigger: document.querySelector('main'),
//   // end: 'bottom top',
//   toggleClass: { targets: '.navb', className: 'is-active'},
//   markers: true,
// });



function init(){
  var keyTL = gsap.timeline(//{
  //   scrollTrigger: {
  //     trigger: document.getElementById("main"),
  //     start: 'top top',
  //     endTrigger: document.getElementById("baby"),
  //     end: 'bottom 40%',
  //     scrub: true,
  //   }
  // }
  )
  keyTL.to(keyMesh.position, {
    scrollTrigger:
    {
      // immediateRender: false,
      trigger: document.getElementById("main"),
      start: 'top top',
      endTrigger: document.getElementById("baby"),
      end: 'top bottom',
      scrub: .8,
    },
    x: 0,
    y: 0.13,
    z: 5.4,
    ease: Power1.easeIn,
    duration: 1,
  })
  .to(keyMesh.position, {
    scrollTrigger:
    {
      immediateRender: false,
      //trigger: renderer.domElement,
      trigger: document.getElementById("baby"),
      start: 'bottom 40%',
      endTrigger: document.getElementById("main"),
      end: 'bottom bottom',
      //pin: true,
      scrub: true,
      //markers: true
    },
    x: 0,
    y: -41.87,
    z: 10,//5.1, //0, //23, //used to be 33
    ease: Power3.easeIn,
    //onEnter: keyMesh.position.set(0, 0.13, 5.4)
  })


  scene.add(TVgroup)
  TVgroup.position.set(0,0.1,2.277);
  domObject.position.set(0 + TVgroup.position.x, -0.14 + TVgroup.position.y, 3.5 + TVgroup.position.z);
  
  // gsap.to(TVgroup.position, {
  //   scrollTrigger:
  //   {
  //     trigger: document.getElementById("main"),
  //     start: 'top top',
  //     endTrigger: document.getElementById("baby"),
  //     end: 'top bottom',
  //     scrub: 1,
  //   },
  //   x: 0,
  //   //y: 0,//4,
  //   z: -5.4,
  //   ease: Power1.easeIn,
  //   onUpdate: (self) => {
  //     domObject.position.set(0 + TVgroup.position.x, -0.14 + TVgroup.position.y, 3.5 + TVgroup.position.z);
  //    }
  // });
  // gsap.to(TVgroup.position, {
  //   scrollTrigger:
  //   {
  //     trigger: document.getElementById("baby"),
  //     start: 'top bottom',
  //     endTrigger: document.getElementById("baby"),
  //     end: 'top 90%',
  //     scrub: 1,
  //     // toggleClass: { targets: 'i', className: 'hidden'},
  //   },
  //   x: 0,
  //   y: 8.4,//4,
  //   ease: Power1.easeIn,
  //   onUpdate: (self) => {
  //     //magic numbers below are initial position offset of TVGroup
  //     domObject.position.set(0 + TVgroup.position.x, -0.14 + TVgroup.position.y, 3.5 + TVgroup.position.z);
  //    }
  // });

  gsap.to(TVgroup.position, {
    scrollTrigger:
    {
      trigger: document.querySelector('main'),
      // trigger: document.querySelector('#baby'),
      endTrigger: document.querySelector('#baby'),
      start: 'top top',
      // start: '3% top',
      end: 'top 97%',
      // end: '3% top',
      // toggleActions: 'play none none reverse',
      scrub: 1,
      // markers: true,
    },
    x: 0,
    y: 0,
    z: 0,
    ease: Power3.easeIn,
    onUpdate: (self) => {
      domObject.position.set(0 + TVgroup.position.x, -0.14 + TVgroup.position.y, 3.5 + TVgroup.position.z);
     }
  });

  


  // gsap.to(keyMesh.position, {
  //   scrollTrigger:
  //   {
  //     trigger: document.getElementById("main"),
  //     start: 'top top',
  //     endTrigger: document.getElementById("baby"),
  //     end: 'top 40%',
  //     scrub: true,
  //   },
  //   x: 0,
  //   y: 0.13,
  //   z: 5.4,
              
  //   //onUpdate: function () {
  //   //  camera.updateProjectionMatrix();
  //   //}
  // });


  var staticOpacityTo = gsap.fromTo(whiteNoiseMaterial, {opacity: 1}, {opacity: 0.052,duration: 4,})
  ScrollTrigger.create({
    trigger: document.getElementById("main"),
    start: 'top top',
    end: 'bottom top',
    toggleActions: 'play none none none',
    //onEnter: DebugHello,
    //markers: true,
    onUpdate: (self) => {
      staticOpacityTo.restart();
      //scrollVelocity = self.getVelocity(); 
  
     }
  })

  initDelay();
  createTitleTL();

  // setTimeout(function(){
  //   initDelay();
  // },500);
}


// seanCenter.addEventListener("click", titleToPage);
// seanNav.addEventListener("click", titleToNav);

function titleToNav() {
  var rect = seanTitle.getBoundingClientRect();
  // var classes = this.classList;
  // seanNav.appendChild(seanTitle);
  seanNav.insertBefore(seanTitle, seanNav.children[0]);
  
  // gsap.set(box, {x: 0, y: 0});
  
  // if(classes.contains('sean')){
  //   gsap.to(seanTitle, 1, { backgroundColor: "red" });
  // } else if(classes.contains('navb')){
  //   gsap.to(seanTitle, 1, { backgroundColor: "blue" });
  // }
  
  var newRect = seanTitle.getBoundingClientRect();

  gsap.from(seanTitle, {
    duration: 1,
    x: rect.left - newRect.left,
    y: rect.top - newRect.top,
    ease: Power3.easeOut
  });
}

function titleToPage() {
  var rect = seanTitle.getBoundingClientRect();
  // var classes = this.classList;
  // seanCenter.appendChild(seanTitle);
  seanCenter.insertBefore(seanTitle, seanCenter.children[0]);
  
  // gsap.set(box, {x: 0, y: 0});
  
  // if(classes.contains('sean')){
  //   gsap.to(seanTitle, 1, { backgroundColor: "red" });
  // } else if(classes.contains('navb')){
  //   gsap.to(seanTitle, 1, { backgroundColor: "blue" });
  // }
  
  var newRect = seanTitle.getBoundingClientRect();

  gsap.from(seanTitle, {
    duration: 1,
    x: rect.left - newRect.left,
    y: rect.top - newRect.top,
    ease: Power3.easeOut
  });
}


//var scrollVelocity = 0;


const testCube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial())

var flashOpacityTo = gsap.fromTo(flashMat, {opacity: 1}, {opacity: 0,duration: 2,})


function DebugHello(){
  //flashMat.opacity = 1;
  // gsap.fromTo(flashMat, {opacity: 1}, {opacity: 0,duration: 4,})
  flashOpacityTo.restart();
  var flashScaleTo = gsap.fromTo(flashModel.scale, {x: 50, y: 50, z: 50}, {x: 0.1, y: 0.1, z: 0.1, duration: 0.4})
  flashScaleTo.play();
  //gsap.to(flashRotSpeed, {var: 0, duration: 1, ease: Power2.easeOut})
}



function rotateFlashFX(){
  if(modelsLoaded){
    flashModel.rotation.z += flashRotSpeed;
  }
}

function rotateIdleKey(){
  if(modelsLoaded){
    keyMesh.rotation.y += 0.0069;
  }
}

function rotateDebug(){
  if(modelsLoaded){
    ProfilePicCircle.rotation.y += 0.0069;
  }
}


var camPassedHand = false;
var camY;
var flashY;
function checkCamZ(){
  if(modelsLoaded){
    camY = camera.position.y;
    flashY = flashModel.position.y;

    if(camY <= flashY + 1.1){
      // console.log('CAMY: ' + camY + ', FLASHY: ' + flashY);
        OnCamPassHand();
    }
    else{
      if(camPassedHand){
        openFist();
      }
    }
  }
}

function OnCamPassHand(){
  if(camPassedHand == false){
    camPassedHand = true;
    closeFist();
    DebugHello();
  }
}
function closeFist(){
  skellyHandOpen.visible = false;
  skellyHandClosed.visible = true;


  keyMesh.visible = false;
}
function openFist(){
  skellyHandOpen.visible = true;
  skellyHandClosed.visible = false;

  keyMesh.visible = true;

  camPassedHand = false;
  flashOpacityTo.time(4);
}


// Static variables - That do not change while scrolling
// var header = $("nav"),
//     headerHeight = header.height(), // Get height of header
//  	 	logo = $("#title"), // Get the logo
//  	 	logoHeight = logo.height(), // Get logo height
//  	 	scrollTo = 60; // Animation until scrolled to this point

// // Scroll function
// $(window).on("scroll", function() {
//   // Dynamic variables - That do change while scrolling
//   var yPos = $(this).scrollTop(), // Get the scroll Y-position
//   	  yPer = (yPos / scrollTo); // Calculate percenage of scroll

//   // If percentage is over 100, set to 100
//   if (yPer > 1) {
//     yPer = 1;
//   }
//   // Dynamic variables for the elements
//   var logoPos = ( -1*(yPer*50)+50), // Calculate position of logo (starting from 50%)
//     	logoSize = ((headerHeight*yPer)-(logoHeight*yPer)+logoHeight); // Calculate new size height for logo
//     	// headerPos = ((yPer * headerHeight) - headerHeight); // Calculate position of header (starting from minus the height of itself)

//   // Change the top, left, transform and height of the logo
//   logo.css({
//     top: logoPos + "%",
//     left: logoPos + "%",
//     transform: "translate3d(-" + logoPos + "%,-" + logoPos + "%,0)",
//     height: logoSize
//   });
//   // Change the transform and opacity of the header
//   // $('nav').css({
//   //   //transform: "translate3d(0," + headerPos + "px,0)",
// 	// 	top: headerPos,
//   //   opacity: yPer
//   // });
// });

// gsap.from(seanTitle, {
//   top: 20 + "%",
//   left: 50 + "%",
//   transform: "translate3d(-" + 50 + "%,-" + 50 + "%,0)",
//   scrollTrigger: {
//     trigger: document.querySelector('#baby'),
//     start: 'bottom bottom',
//     end: 'top top',
//     scrub: true,
//   },
//   onStart: seanNav.insertBefore(seanTitle, seanNav.children[0]),
// });

// ScrollTrigger.addEventListener("refreshInit", resize);
// resize();

let bobTL = gsap.timeline({repeat: -1});
let titleTL; /* gsap.timeline(); */

const small = window.matchMedia("(max-width: 767px)");
const medium = window.matchMedia("(min-width: 768px) and (max-width: 1279px)");
const large = window.matchMedia("(min-width: 1280px) and (max-width: 1919px)");
const xlarge = window.matchMedia("(min-width: 1920px) and (max-width: 2559px)");
const xxlarge = window.matchMedia("(min-width: 2560px)");

function createTL() {
  if(bobTL) {
    bobTL.kill();
  }
  
  bobTL = gsap.timeline({repeat: -1});
  bobTL.fromTo('i', {y: getYValue}, {duration: 3, y: 0});
}

function getYValue() {
  if(small.matches) {
      return -10;
  } else if (medium.matches) {
      return -20;
  } else if (large.matches) {
      return -30;
  } else if (xlarge.matches) {
      return -40;
  } else if (xxlarge.matches) {
      return -50;
  } else {
      return 0
  }
};

small.addEventListener("change", () =>{
  createTL();
  // console.log('SMALL');
});
medium.addEventListener("change", () =>{
  createTL();
  // console.log('MEDIUM');
});
large.addEventListener("change", () =>{
  createTL();
  // console.log('LARGE');
});
xlarge.addEventListener("change", () =>{
  createTL();
  // console.log('XLARGE');
});
xxlarge.addEventListener("change", () =>{
  createTL();
  // console.log('XXLARGE');
});
createTL();



var titleBoxOffsetX = 0;
var titleBoxOffsetY = 0;

function createTitleTL() {
  if(titleTL) {
    lastTitleTLprogress = titleTL.progress();
    titleBoxOffsetX = (titleWidth / (2.0 - lastTitleTLprogress)) / 2.0;
    titleBoxOffsetY = (titleHeight / (2.0 - lastTitleTLprogress)) / 2.0;
    titleTL.kill();
    // console.log('titleTL killed, with a width of: ' + titleWidth);
  }
  else{
    titleBoxOffsetX = titleWidth / 2.0;
    titleBoxOffsetY = titleHeight / 2.0;
    // console.log('titleTL doesnt exist yet, current titlewidth: ' + titleWidth);
  }
  
  titleTL = gsap.timeline({
    scrollTrigger: {
      trigger: document.querySelector('main'),
      // trigger: document.querySelector('#baby'),
      endTrigger: document.querySelector('#baby'),
      start: 'top top',
      // start: '3% top',
      end: 'top 97%',
      // end: '3% top',
      // toggleActions: 'play none none reverse',
      scrub: 1,
      // markers: true,
    },
  });
  titleTL.fromTo('#title', {
    scaleX: 2,
    scaleY: 2,
    // fontSize: 90 + 'px',
    x: viewportSize.width / 2.0 - titleBoxOffsetX - parseFloat((window.getComputedStyle(navbar, null).getPropertyValue('padding-left'))),
    y: viewportSize.height * 0.83 - titleBoxOffsetY,
  }, {
    scaleX: 1,
    scaleY: 1,
    // fontSize: 40 + 'px',
    x:0,y:0,
    // ease: Power3.easeOut,
  });
}

// gsap.timeline({
//   scrollTrigger: {
//     trigger: document.querySelector('#title'),
//     start: 'bottom 3%',
//     toggleClass: { targets: '.navb', className: 'is-active'},
//     markers: true,
//   }
// })

var titleZPos;
var titleZPosWOffset;
var titlePassedNav = false;
function navToggleOnTitlePass(){
  titleZPos = seanTitle.getBoundingClientRect().y;
  titleZPosWOffset = titleZPos + seanTitle.getBoundingClientRect().height;

  if(titleZPosWOffset <= navbar.getBoundingClientRect().height + 8){
    if(!titlePassedNav){
      navbar.classList.toggle('is-active');
      titlePassedNav = true;
    }
  }
  else{
    if(titlePassedNav){
      navbar.classList.toggle('is-active');
      titlePassedNav = false;
    }
  }
}



function initDelay(){
  titleRect = seanTitle.getBoundingClientRect();
  titleHeight = titleRect.height;
  titleWidth = titleRect.width;
  titleLeftPadding = parseFloat(window.getComputedStyle(navbar, null).getPropertyValue('padding-left'));

  // gsap.from('#title', {
  //   // fontSize: 80 + 'px',
  //   x: viewportSize.width / 2.0 - titleWidth / 2.0 - parseFloat((window.getComputedStyle(navbar, null).getPropertyValue('padding-left'))),
  //   y: (viewportSize.height * 0.2) - (titleHeight / 2),
  //   scrollTrigger: {
  //     trigger: document.querySelector('#baby'),
  //     start: 'bottom bottom',
  //     end: 'top top',
  //     scrub: true,
  //   },
  // });
  // gsap.from('#title', {
  //   fontSize: 80 + 'px',
  //   xPercent:-50, yPercent:-50, left:"50%", top:"50%",
  //   scrollTrigger: {
  //     trigger: document.querySelector('#baby'),
  //     start: 'bottom bottom',
  //     end: 'top top',
  //     scrub: true,
  //   },
  // });
};

function updateTitle(){
  titleRect = seanTitle.getBoundingClientRect();
  titleHeight = titleRect.height;
  titleWidth = titleRect.width;
  titleLeftPadding = parseFloat(window.getComputedStyle(navbar, null).getPropertyValue('padding-left'));
  // ScrollTrigger.refresh();
};


const clock = new THREE.Clock();
clock.autoStart = true;
var delta
function tick(){

  //update with elapsed time to mimic delta second action
  const elapsedTime = clock.getElapsedTime()
  renderer.render(scene, camera);
  renderer2.render(scene2, camera);
  requestAnimationFrame( tick );

  //delta = clock.getDelta();

	// if ( mixer ) mixer.update( delta );

  rotateFlashFX();
  rotateIdleKey();
  checkCamZ();

  rotateDebug();


  navToggleOnTitlePass();

  uniforms.time.value = clock.getElapsedTime();


  //console.log("Number of Triangles :", renderer.info.render.triangles);
  updateTitle();
  // console.log(titleZPosWOffset);
}
tick();