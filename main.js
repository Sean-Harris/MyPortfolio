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

var modelsLoaded = false;

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
const gui = new GUI();


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

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
//camera.lookAt(66,40,35);
camera.position.set(0, 0, 6.3);

const camGui = gui.addFolder('Camera');
const camPos = camGui.addFolder('Position');

camPos.add(camera.position, 'x').listen();
camPos.add(camera.position, 'y').listen();
camPos.add(camera.position, 'z').listen();


const renderer2 = new CSS3DRenderer();
    renderer2.setSize( window.innerWidth, window.innerHeight );
    renderer2.domElement.style.position = 'fixed';
    renderer2.domElement.style.top = 0;
    document.querySelector('#css').appendChild( renderer2.domElement );


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

//camera.lookAt(0,20,0);
/*
 * LIGHTS
 */
const targetObject = new THREE.Object3D();
const originTarget = new THREE.Object3D();
targetObject.position.set(-420,-500,400);
scene.add(targetObject, originTarget);

const pointLight = new THREE.PointLight(0x00ffff, 1);
pointLight.position.set(10,-9,-3);
//pointLight.castShadow = true; // default false
const lightHelper = new THREE.PointLightHelper(pointLight);
const pointLight2 = new THREE.PointLight(0xe60944, 1);
pointLight2.position.set(-10,-32,0);
const directionalLight = new THREE.DirectionalLight(0xffeba1, 1);
//directionalLight.target = targetObject;
//pointLight.castShadow = true;
directionalLight.target = targetObject;
//scene.add(directionalLight);
//pointLight.position.set(0, 13, -10);
const ambientLight = new THREE.AmbientLight(0xffffff,.1);
scene.add(pointLight, lightHelper);
scene.add(pointLight2);


class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

const lightGui1 = gui.addFolder('Light1');
lightGui1.add(pointLight.position, 'x');
lightGui1.add(pointLight.position, 'y');
lightGui1.add(pointLight.position, 'z');
lightGui1.addColor(new ColorGUIHelper(pointLight, 'color'), 'value').name('color');
lightGui1.add(pointLight, 'intensity');

const lightGui2 = gui.addFolder('Light2');
lightGui2.add(pointLight2.position, 'x')
lightGui2.add(pointLight2.position, 'y')
lightGui2.add(pointLight2.position, 'z')
lightGui2.addColor(new ColorGUIHelper(pointLight2, 'color'), 'value').name('color');
lightGui2.add(pointLight2, 'intensity');



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
  height: window.innerHeight
};

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
  speed: {value: 10.0},
  charSize: {value: {x:20.0, y:10.5}},
  charResolution: {value: 1.0},
  color: {value: new THREE.Color(0xff002b)},
  backgroundColor: {value: new Vector4(0,0,0,1)},
  resolution: {value: {x:10.0, y:10.0}}
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
      o.receiveShadow= true;
    };
  });

  scene.add(gltfScene.scene);
});

var skellyHandOpen;
var skellyHandClosed;

const gltfLoader2 = new GLTFLoader(loadingManager);
gltfLoader2.load('/assets/skeleton/skellyArmUV.gltf', (gltfScene) => {
  gltfScene.scene.scale.set(5,5,5);
  gltfScene.scene.position.set(0.13, -27, -4);
  skellyHandOpen = gltfScene.scene;

  gltfScene.scene.traverse((o) => {
    if (o.isMesh) {
      o.material = skellyMat;
      //o.castShadow = true;
      o.receiveShadow= true;
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
  console.log('stroke my shaft ' + gltfScene);
  gltfScene.scene.scale.set(10,10,10);
  gltfScene.scene.position.set(0, -19, -6);
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
  gltfScene.scene.position.set(0.13, -27, -4);
  skellyHandClosed = gltfScene.scene;

  gltfScene.scene.traverse((o) => {
    if (o.isMesh) {
      //o.material = digiMat;
      o.material = skellyMat;
      //o.castShadow = true;
      o.receiveShadow= true;
    };
  });
  scene.add(gltfScene.scene);
  gltfScene.scene.visible = false;
});

const TVgroup = new THREE.Group();

const gltfLoader5 = new GLTFLoader(loadingManager);
gltfLoader5.load('./assets/tv/TV2/tv2.gltf', function(gltfScene) {
  gltfScene.scene.scale.set(.09,.09,.09);
  gltfScene.scene.rotation.set(0,-1.5708,0)
  gltfScene.scene.position.set(0, -0.3, 3);

  // gltfScene.scene.traverse((o) => {
  //   if (o.isMesh) {
  //     o.material = digiMat;
  //     //o.material = skellyMat;
  //   };
  // });
  scene.add(gltfScene.scene);
});




//var content = document.getElementById("css").innerHTML;

// var video = document.getElementById('static2');
// video.src = "./StaticVideo.mp4";
// video.load();
// video.addEventListener('loadeddata', function() {
  
// }, false);

//ytplayerDivElement.id = 'screenDiv';
var ytplayerDivElement = document.createElement( 'div' )
        
ytplayerDivElement.innerHTML = '<object type="text/html" data="ScreenPage.html" ></object>';

var domObject = new CSS3DObject( ytplayerDivElement );
domObject.position.set(0,-0.14,3.5)
domObject.scale.set(.008,.008,.008)
scene2.add( domObject );

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
//mesh.scale.copy( domObject.scale );
mesh.castShadow = false;
mesh.receiveShadow = true;
scene.add(mesh);
// domObject.position.set(0,0,0)




var ytplayerDivElement2 = document.createElement( 'div' );
ytplayerDivElement2.id = 'screenDiv2';
                  
//ytplayerDivElement2.innerHTML = '<object type="text/html" data="ScreenPage.html" ></object>';
          
var domObject2 = new CSS3DObject( ytplayerDivElement2 );
domObject2.position.set(0,0,-200)
domObject2.scale.set(.1,.1,.1)
          
          
var material2 = new THREE.MeshPhongMaterial({
  opacity	: 0.2,
  color	: new THREE.Color('black'),
  blending: THREE.NoBlending,
  side	: THREE.DoubleSide,
});
var geometry2 = new THREE.PlaneGeometry( 100, 100 );
var mesh2 = new THREE.Mesh( geometry2, material2 );
mesh2.position.copy( domObject2.position );
mesh2.rotation.copy( domObject2.rotation );
mesh.scale.copy( domObject.scale );
mesh2.castShadow = false;
mesh2.receiveShadow = true;

gsap.registerPlugin(ScrollTrigger);
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
      trigger: document.getElementById("main"),
      start: 'top top',
      endTrigger: document.getElementById("baby"),
      end: 'top 40%',
      scrub: true,
    },
    x: 0,
    y: 0.13,
    z: 5.4,
    ease: Power1.easeIn
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
  })


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

  




  // gsap.to(keyMesh.position, {
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
  //   z: 3.5, //0, //23, //used to be 33
  //   ease: Power1.easeIn,
              
  //   //onUpdate: function () {
  //   //  camera.updateProjectionMatrix();
  //   //}
  // });

  var staticOpacityTo = gsap.fromTo(whiteNoiseMaterial, {opacity: 1}, {opacity: 0.042,duration: 4,})
  ScrollTrigger.create({
    trigger: document.getElementById("main"),
    start: 'top top',
    end: 'bottom top',
    toggleActions: 'play none none none',
    //onEnter: DebugHello,
    //markers: true,
    onUpdate: (self) => {
      staticOpacityTo.restart();
      scrollVelocity = self.getVelocity(); 
  
     }
  })

  

  //gsap.fromTo(whiteNoiseMaterial, {opacity: 1}, {opacity: 0,duration: 2,})

  // gsap.fromTo(digiMatHexColor, {value: 0xFF0075}, {value: 0x80ff00,
  // duration: 5})
}


var scrollVelocity = 0;

// ScrollTrigger.create({
//   trigger: document.getElementById("main"),
//   start: 'bottom center',
//   end: 'bottom top',
//   toggleActions: 'play none none none',
//   //onEnter: DebugHello,
//   //markers: true,
//   onUpdate: (self) => {
//     //staticOnScroll;
//     scrollVelocity = self.getVelocity(); 

//    }
// })




// function staticOnScroll(){
//     staticOpacityTo.restart();
  


// }
//document.body.onscroll = staticOnScroll();



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


var camPassedHand = false;
var camY;
var flashY;
function checkCamZ(){
  if(modelsLoaded){
    camY = camera.position.y;
    flashY = flashModel.position.y;

    if(camY <= flashY + 1){
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
var staticLoaded = false;
function checkIfStaticReady(){
  if ( whiteNoiseElement.readyState === 4 ) {
    
  staticLoaded = true;
  }
}


const clock = new THREE.Clock();
function tick(){

  //update with elapsed time to mimic delta second action
  const elapsedTime = clock.getElapsedTime()
  renderer.render(scene, camera);
  renderer2.render(scene2, camera);
  //cssRenderer.render(cssScene, camera);
  requestAnimationFrame( tick );

  var delta = clock.getDelta();

	if ( mixer ) mixer.update( delta );

  rotateFlashFX();
  rotateIdleKey();
  checkCamZ();

  // if(!staticLoaded){
  //   checkIfStaticReady();
  // }

  //whiteNoiseMaterial.opacity=scrollVelocity;
  //scrollVelocity=0;

  uniforms.time.value = clock.getElapsedTime();
  //uniforms.color.value =
}
tick();