import './style.css'
import * as THREE from 'three';
//import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GUI } from 'dat.gui';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SplineCurve, Vector3 } from 'three';
//import { LayerMaterial, Color } from 'lamina/vanilla'
import fShader from './fragmentShader.glsl.js'
import vShader from './vertexShader.glsl.js'

// const _VS = `
// uniform float time;
// varying vec2 vUv;
// varying vec3 vPosition;
// uniform vec2 pixels;
// float PI = 3.141592653589793238;
// void main(){
//   vUv = uv;
//   gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
// }
// `;
// const _VS = `
// precision highp float;
// precision highp int;

// varying vec2 vUv;
// varying vec3 vPosition;
// varying vec3 vNormal;

// void main() {
//   vUv = uv;
//   vPosition = position;
//   vNormal = normal;
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
// `;

// const uniforms = {
//   color: {value: {x:1,y:1,z:1}},
//   time: {value: 0.0},
//   twinkleSpeed: {value: 200.0},
//   speed: {value: 0.0001},
//   brightness: {value: 0.0018},
//   distfading: {value: 0.7},
// };

// const _FS = `
// // http://casual-effects.blogspot.com/2013/08/starfield-shader.html
// #extension GL_OES_standard_derivatives : enable

// #define iterations 17
// #define volsteps 3
// #define sparsity 0.5
// #define stepsize 0.2
//  #define frequencyVariation   1.3

// precision highp float;
// precision highp int;

// varying vec2 vUv;
// varying vec3 vPosition;
// varying vec3 vNormal;

// uniform vec3 color;
// uniform float time;
// uniform float twinkleSpeed;
// uniform float speed;
 
// uniform float brightness;
// uniform float distfading;
 

// #define PI 3.141592653589793238462643383279

// void main( void ) {

//     vec2 uv = vUv.xy + 0.5;
//     uv.x += time * speed * 0.1;
 
//     vec3 dir = vec3(uv * 2.0, 1.0);
 
//     float s = 0.1, fade = 0.01;
//     vec3 starColor = vec3(0.0);
     
//     for (int r = 0; r < volsteps; ++r) {
//         vec3 p =  (time * speed * twinkleSpeed) + dir * (s * 0.5);
//         p = abs(vec3(frequencyVariation) - mod(p, vec3(frequencyVariation * 2.0)));
 
//         float prevlen = 0.0, a = 0.0;
//         for (int i = 0; i < iterations; ++i) {
//             p = abs(p);
//             p = p * (1.0 / dot(p, p)) + (-sparsity); // the magic formula            
//             float len = length(p);
//             a += abs(len - prevlen); // absolute sum of average change
//             prevlen = len;
//         }
         
//         a *= a * a; // add contrast
         
//         // coloring based on distance        
//         starColor += (vec3(s, s*s, s*s*s) * a * brightness + 1.0) * fade;
//         fade *= distfading; // distance fading
//         s += stepsize;
//     }
     
//     starColor = min(starColor, vec3(1.2));
 
//     // Detect and suppress flickering single pixels (ignoring the huge gradients that we encounter inside bright areas)
//     float intensity = min(starColor.r + starColor.g + starColor.b, 0.7);
 
//     vec2 sgn = (vec2(vUv.xy)) * 2.0 - 1.0;
//     vec2 gradient = vec2(dFdx(intensity) * sgn.x, dFdy(intensity) * sgn.y);
//     float cutoff = max(max(gradient.x, gradient.y) - 0.1, 0.0);
//     starColor *= max(1.0 - cutoff * 6.0, 0.3);
 
//     // Motion blur; increases temporal coherence of undersampled flickering stars
//     // and provides temporal filtering under true motion.  
//     gl_FragColor = vec4( starColor * color, 1.0 );
// }
// `;




// const _FS = `
// uniform flaot time;
// uniform float progress;
// uniform sampler2D texture1;
// uniform vec4 resolution;
// varying vec2 vUv;
// varying vec3 vPosition;
// float PI = 3.141592653589793238;
// void main(){
//   gl_FragColor = vec4(vUv,0.0,1)
// }
// `;



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
//scene.add(skybox);

scene.background = new THREE.Color(0xFFE8DC); //FFE8DC

//const scene2 = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 10000);
//camera.lookAt(66,40,35);
camera.position.set(-20, 12, 34);

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

camera.lookAt(0,20,0);
/*
 * LIGHTS
 */
const targetObject = new THREE.Object3D();
const originTarget = new THREE.Object3D();
targetObject.position.set(-420,-500,400);
scene.add(targetObject, originTarget);

const pointLight = new THREE.PointLight(0xfffffff, 1);
pointLight.position.set(10,15,0);
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

window.addEventListener('resize', () => {
  viewportSize.width = window.innerWidth;
  viewportSize.height = window.innerHeight;

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




const gltfLoader = new GLTFLoader();
gltfLoader.load('/assets/skeleton/skeletonArm_R.gltf', (gltfScene) => {
  gltfScene.scene.scale.set(2,2,2);

  const skellyMat = new THREE.MeshToonMaterial({
    //gradientMap: threeTone,
    color: 0x34ebab
  });


  gltfScene.scene.traverse((o) => {
    if (o.isMesh) {
      o.material = skellyMat;
      //o.castShadow = true;
      o.receiveShadow= true;
    };
  });

  scene.add(gltfScene.scene);
});

const uniforms = {
  time: {value: 0.0},
  speed: {value: 18.0},
  charSize: {value: {x:2.0, y:1.5}},
  charResolution: {value: 6.0},
  color: {value: new THREE.Color(0xf0075c)},
  //backgroundColor: {value: {x:240.0, y:7.0, z:92.0, w:0.0}},
  resolution: {value: {x:1.0, y:1.0}}
};

const skellyMat2 = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vShader,
  fragmentShader: fShader
});

const gltfLoader2 = new GLTFLoader();
gltfLoader2.load('/assets/skeleton/switch/skellyArmUV.gltf', (gltfScene) => {
  gltfScene.scene.scale.set(5,5,5);
  gltfScene.scene.position.setZ(10);

  


  gltfScene.scene.traverse((o) => {
    if (o.isMesh) {
      o.material = skellyMat2;
      //o.castShadow = true;
      o.receiveShadow= true;
    };
  });

  scene.add(gltfScene.scene);
});

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






        const contentCubeMatArray = [];
        const cc_ft = material;
        const cc_bk = new THREE.TextureLoader().load('/assets/skybox/back.png');
        const cc_up = new THREE.TextureLoader().load('/assets/skybox/top.png');
        const cc_dn = new THREE.TextureLoader().load('/assets/skybox/bottom.png');
        const cc_rt = new THREE.TextureLoader().load('/assets/skybox/right.png');
        const cc_lf = new THREE.TextureLoader().load('/assets/skybox/left.png');

        contentCubeMatArray.push(new THREE.MeshPhongMaterial({map: cc_ft}));
        contentCubeMatArray.push(new THREE.MeshBasicMaterial({map: cc_bk}));
        // contentCubeMatArray.push(new THREE.MeshBasicMaterial({map: cc_up}));
        // contentCubeMatArray.push(new THREE.MeshBasicMaterial({map: cc_dn}));
        // contentCubeMatArray.push(new THREE.MeshBasicMaterial({map: cc_rt}));
        // contentCubeMatArray.push(new THREE.MeshBasicMaterial({map: cc_lf}));

        // for(let i=0;i<6;i++)
        // contentCubeMatArray[i].side = THREE.BackSide;

        const contentCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const contentCube = new THREE.Mesh(contentCubeGeometry, contentCubeMatArray);
        //scene.add(contentCube);
        scene.add( mesh, mesh2 );
        //scene.add(group);




          gsap.registerPlugin(ScrollTrigger);
          //set camera position
          camera.position.y = 18;
          camera.position.z = 34;
          camera.position.x = -7;
          camera.lookAt(-10,12,-170);
          gsap.to(camera.position, {
            scrollTrigger:
            {
              //trigger: renderer.domElement,
              trigger: document.getElementById("main"),
              start: 'top top',
              end: 'bottom center',
              //pin: true,
              scrub: .42,
              markers: true
            },
            x: 0,
            y: 9,
            z: -3,
            ease: "none",
            
            //onUpdate: function () {
            //  camera.updateProjectionMatrix();
            //}
          })
        


const clock = new THREE.Clock();
function tick(){
  //update with elapsed time to mimic delta second action
  const elapsedTime = clock.getElapsedTime()


  
  //moveCamera();


  renderer.render(scene, camera);
  //renderer2.render(scene2, camera);
  //cssRenderer.render(cssScene, camera);
  requestAnimationFrame( tick );
  uniforms.time.value = clock.getElapsedTime();
}
tick();