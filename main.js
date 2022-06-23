import './style.css?parameter=1'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GUI } from 'dat.gui';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SplineCurve, Vector3, Vector4 } from 'three';
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

const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = function(url, item, total){
  console.log('started loading')
}
const loadingScreenContainer = document.querySelector('.loader-wrapper');
loadingManager.onLoad = function(url, item, total){
  loadingScreenContainer.style.display = 'none';
  modelsLoaded = true;
  
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

const skyboxInterstellar = new THREE.BoxGeometry(10000, 10000, 10000);
const skybox = new THREE.Mesh(skyboxInterstellar, skyMatArray);
scene.add(skybox);

scene.background = new THREE.Color(0x000000); //FFE8DC

//const scene2 = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 10000);
//camera.lookAt(66,40,35);
camera.position.set(0, 0, 6);

const camGui = gui.addFolder('Camera');
const camPos = camGui.addFolder('Position');

camPos.add(camera.position, 'x').listen();
camPos.add(camera.position, 'y').listen();
camPos.add(camera.position, 'z').listen();


// const renderer2 = new CSS3DRenderer();
//     renderer2.setSize( window.innerWidth, window.innerHeight );
//     renderer2.domElement.style.position = 'fixed';
//     renderer2.domElement.style.top = 0;
//     document.querySelector('#css').appendChild( renderer2.domElement );
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

const pointLight = new THREE.PointLight(0xfffffff, 1);
pointLight.position.set(10,-15,0);
const pointLight2 = new THREE.PointLight(0xe60944, 1);
pointLight2.position.set(-10,-15,0);
const directionalLight = new THREE.DirectionalLight(0xffeba1, 1);
//directionalLight.target = targetObject;
pointLight.castShadow = true;
directionalLight.target = targetObject;
//scene.add(directionalLight);
//pointLight.position.set(0, 13, -10);
const ambientLight = new THREE.AmbientLight(0xffffff,.1);
scene.add(pointLight, pointLight2);

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
const viewportSize = {
  width: window.innerWidth,
  height: window.innerHeight
};
var widthHalf = width / 2, heightHalf = height / 2;

window.addEventListener('resize', () => {
  viewportSize.width = window.innerWidth;
  viewportSize.height = window.innerHeight;

  height =
  document.documentElement.scrollHeight - document.documentElement.clientHeight;

  camera.aspect = viewportSize.width / viewportSize.height;
  camera.updateProjectionMatrix();

  renderer.setSize(viewportSize.width, viewportSize.height);
  renderer.setPixelRatio(Map.min(window.devicePixelRatio, 2));
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

// let diagetic = document.getElementById('player');
// const canvasTexture = new THREE.CanvasTexture(diagetic);

// const planeGeometry = new THREE.BoxGeometry(100,100,100);
// const testTexture = new THREE.MeshBasicMaterial({map: canvasTexture})


// //const planeGeometry = new THREE.BoxGeometry(100,100,100);
// const planeMesh = new THREE.Mesh(planeGeometry, testTexture);

// scene.add(planeMesh);

// function load_home() {
//   document.getElementById("content").innerHTML='<object type="text/html" data="home.html" ></object>';
// }




// const geometryTest = new THREE.SphereGeometry(1, 128, 64)
// const materialTest = new LayerMaterial({
//   color: '#d9d9d9',
//   shading: 'physical',
//   transmission: 1,
//   layers: [
//     new Depth({
//       colorA: '#002f4b',
//       colorB: '#f2fdff',
//       alpha: 0.5,
//       mode: 'multiply',
//       near: 0,
//       far: 2,
//       origin: new THREE.Vector3(1, 1, 1),
//     }),
//   ],
// })

// const meshTest = new THREE.Mesh(geometryTest, materialTest)
// scene.add(meshTest);

const skellyMat = new THREE.MeshToonMaterial({
  //gradientMap: threeTone,
  color: 0xffffff,
});

const uniforms = {
  time: {value: 0.0},
  speed: {value: 18.0},
  charSize: {value: {x:2.0, y:1.5}},
  charResolution: {value: 7.0},
  color: {value: new THREE.Color(0xFF0075)},
  backgroundColor: {value: new Vector4(0,0,0.1,1)},
  resolution: {value: {x:4.0, y:4.0}}
};

// const uniforms2 = {
//   cameraPosition: {value: {x: 0, y:0, z:0}},
//   time: {value: 0.0},
//   color: {value: new THREE.Color(0xf0075c)},
//   lightPosition: {value: {x: 0, y:0, z:0}},
//   borderWidth: {value: 0.45},
//   toonNoise1: {value: new THREE.TextureLoader().load('/assets/skybox/top.png')},
//   toonNoise2: {value: new THREE.TextureLoader().load('/assets/skybox/top.png')},
// };

const skellyMat2 = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vShader,
  fragmentShader: fShader
});


const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.load('/assets/key/scene.gltf', (gltfScene) => {
  gltfScene.scene.scale.set(4,4,4);

  gltfScene.scene.traverse((o) => {
    if (o.isMesh) {
      o.material = skellyMat2;
      //o.castShadow = true;
      o.receiveShadow= true;
    };
  });

  scene.add(gltfScene.scene);
});

var skellyHandOpen;
var skellyHandClosed;

const gltfLoader2 = new GLTFLoader(loadingManager);
gltfLoader2.load('/assets/skeleton/switch/skellyArmUV.gltf', (gltfScene) => {
  gltfScene.scene.scale.set(5,5,5);
  gltfScene.scene.position.set(0.13, -27, -4);

  gltfScene.scene.traverse((o) => {
    if (o.isMesh) {
      o.material = skellyMat;
      o.castShadow = true;
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

var flashRotSpeed = 0.05;

const gltfLoader3 = new GLTFLoader(loadingManager);
gltfLoader3.load('./assets/flash/scene.gltf', function(gltfScene) {
  console.log('stroke my shaft ' + gltfScene);
  gltfScene.scene.scale.set(10,10,10);
  gltfScene.scene.position.set(0, -17, -5);
  flashModel = gltfScene.scene;

  //gltfScene.scene.parent = dubShitTestCube;
  //

  gltfScene.scene.traverse(function(o) {
    if (o.isMesh) {
      o.material = flashMat;
    };
  });
  // mixer = new THREE.AnimationMixer( gltfScene.scene );
  //       gltfScene.animations.forEach( ( clip ) => {
  //           mixer.clipAction( clip ).play();
  //       });
        scene.add(gltfScene.scene);
        //gltfScene.scene.visible = false;
        sugma();
});

function sugma(){
  console.log('suck my balls ' + flashModel);
}

//var content = document.getElementById("css").innerHTML;

const group = new THREE.Group();

var ytplayerDivElement = document.createElement( 'div' );
ytplayerDivElement.id = 'screenDiv';
        
        ytplayerDivElement.innerHTML = '<object type="text/html" data="PHPageContent.html" ></object>';

        var domObject = new CSS3DObject( ytplayerDivElement );
        domObject.position.set(0,-30,-69)
        // domObject.position.y = Math.random() * 600 - 300;
        // domObject.position.z = Math.random() * 800 - 600;
        // domObject.rotation.x = Math.random();
        // domObject.rotation.y = Math.random();
        // domObject.rotation.z = Math.random();
        //domObject.scale.x = Math.random() + 0.5;
        //domObject.scale.y = Math.random() + 0.5;
        //scene2.add( domObject );
        //group.add(domObject);


          var material = new THREE.MeshPhongMaterial({
              opacity	: 0.2,
              color	: new THREE.Color('black'),
              blending: THREE.NoBlending,
              side	: THREE.DoubleSide,
          });
          var geometry = new THREE.PlaneGeometry( 100, 100 );
          var mesh = new THREE.Mesh( geometry, material );
          mesh.position.copy( domObject.position );
          mesh.rotation.copy( domObject.rotation );
          //mesh.scale.copy( domObject.scale );
          mesh.castShadow = false;
          mesh.receiveShadow = true;


          var ytplayerDivElement2 = document.createElement( 'div' );
          ytplayerDivElement2.id = 'screenDiv2';
                  
                  ytplayerDivElement2.innerHTML = '<object type="text/html" data="ScreenPage.html" ></object>';
          
                  var domObject2 = new CSS3DObject( ytplayerDivElement2 );
                  domObject2.position.set(10,-3,69)
                  // domObject.position.y = Math.random() * 600 - 300;
                  // domObject.position.z = Math.random() * 800 - 600;
                  // domObject.rotation.x = Math.random();
                  // domObject.rotation.y = Math.random();
                  // domObject.rotation.z = Math.random();
                  //domObject.scale.x = Math.random() + 0.5;
                  //domObject.scale.y = Math.random() + 0.5;
                  //scene2.add( domObject2 );
                  //group.add(domObject2);
          
          
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
                    //mesh.scale.copy( domObject.scale );
                    mesh2.castShadow = false;
                    mesh2.receiveShadow = true;



//object from world position to screenspace(?)
                    // let pos = new THREE.Vector3();
                    // pos = pos.setFromMatrixPosition(object.matrixWorld);
                    // pos.project(camera);
                    
                    // let widthHalf = canvasWidth / 2;
                    // let heightHalf = canvasHeight / 2;
                    
                    // pos.x = (pos.x * widthHalf) + widthHalf;
                    // pos.y = - (pos.y * heightHalf) + heightHalf;
                    // pos.z = 0;
                    
                    // console.log(pos);



          gsap.registerPlugin(ScrollTrigger);
          gsap.to(camera.position, {
            scrollTrigger:
            {
              //trigger: renderer.domElement,
              trigger: document.getElementById("body"),
              start: 'top top',
              end: 'bottom bottom',
              //pin: true,
              scrub: 0.39,
              //markers: true
            },
            x: 0,
            y: -42,
            z: 33,
            ease: "power0",
            
            //onUpdate: function () {
            //  camera.updateProjectionMatrix();
            //}
          });

// gsap.to(flashMat, {
//   opacity: 1.0,
//   scrollTrigger: {
//     trigger: document.getElementById("main2"),
//     start: 'top center',
//     end: 'center bottom',
//     scrub: true,

//   },
// })

ScrollTrigger.create({
  trigger: document.getElementById("main"),
  start: 'bottom center',
  end: 'bottom top',
  toggleActions: 'play none none none',
  onEnter: DebugHello,
  markers: true,
})

const testCube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial())

function DebugHello(){
  //flashMat.opacity = 1;
  gsap.fromTo(flashMat, {opacity: 1}, {opacity: 0,duration: 4,})
  //gsap.to(flashRotSpeed, {var: 0, duration: 1, ease: Power2.easeOut})
}

function rotateFlashFX(){
  if(modelsLoaded){
    flashModel.rotation.z += flashRotSpeed;
  }
}



const clock = new THREE.Clock();
function tick(){

  //update with elapsed time to mimic delta second action
  const elapsedTime = clock.getElapsedTime()
  renderer.render(scene, camera);
  //renderer2.render(scene2, camera);
  //cssRenderer.render(cssScene, camera);
  requestAnimationFrame( tick );

  var delta = clock.getDelta();

	if ( mixer ) mixer.update( delta );

  //rotatedub();
  rotateFlashFX();

  uniforms.time.value = clock.getElapsedTime();
}
tick();