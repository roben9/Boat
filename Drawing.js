import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { gsap } from "gsap";
// import Boat from "./Physic";
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';

// var boat = new Boat();
let water ;


// Canvas
const canvas = document.querySelector("canvas.webgl");

// Textures
const textureLoader = new THREE.TextureLoader();


// Scene
const scene = new THREE.Scene();

//////////////////////////////////////////camera and resize  ////////////////////////////////////////////
// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};


///////////////////////////////////////Model/////////////////////////
///إظهار المحاور
// var axesHelper = new THREE.AxesHelper(500);
// scene.add(axesHelper);

const loader = new GLTFLoader();
const mixers = [];
const models = [];
let animationPaused = true;

function loadModel(
  modelPath,
  modelLocation,
  modelScale,
  animationIndex,
  modelRotations
) {
  loader.load(
   modelPath,
    function (gltf) {
      const mixer = new THREE.AnimationMixer(gltf.scene);
      const animation = gltf.animations[animationIndex];
      if (animation) {
        const action = mixer.clipAction(animation);
        mixers.push(mixer);
        action.play();
      }

      const model = gltf.scene;
      model.scale.set(modelScale.x, modelScale.y, modelScale.z);
      model.position.set(modelLocation.x, modelLocation.y, modelLocation.z);
      model.rotation.set(modelRotations.x, modelRotations.y, modelRotations.z);
      scene.add(model);

      models.push(model);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}
//{x:0, y:0 , z:0} //موقع الموديل
// {x: 62.61510852659688, y: 5.445669508239044, z: -17.478215700108652} //  الموقع يلي بدي انقل عليه
// _______________________________________________________
// {x: -62.61510852659688 , y: -5.445669508239044, z: 17.478215700108652}                   // الموقع يلي بدي انقل علبه - موقع الموديل

const modelPaths = ["models/low_poly_sailing_boat.glb","models/pine_island.glb","models/low_poly_island.glb","models/bird.glb","models/bird.glb"];

const modelLocations = [
  { x: 0, y: 0, z: 0 },
  { x: 200, y: 0, z: -600},
  { x: -600, y: -50, z: -200 },
  { x: 500, y: 250, z: -200 },
  { x: -800, y: 250, z: -200 },
];
const modelRotations = [
  { x: 0, y:  -Math.PI * 0.88, z: 0 },
  { x: 0, y: -Math.PI * 0.88, z: 0 },
  { x: 0, y: -Math.PI * 0.88, z: 0 },
  { x: 0, y: -Math.PI * 0.88, z: 0 },
  { x: 0, y: -Math.PI * 0.88, z: 0 },
];

const modelScales = [
  { x: 0.3, y: 0.3, z:0.3 },
  { x: 200, y: 200, z: 200 },
  { x: 100, y: 100, z: 30 },
  { x: 200, y: 200, z: 200 },
  { x: 100, y: 150, z: 200 },
  { x: 100, y: 150, z: 200 },
];

const animationIndices = [0];

for (let i = 0; i < modelPaths.length; i++) {
  loadModel(
    modelPaths[i],
    modelLocations[i],
    modelScales[i],
    animationIndices[i],
    modelRotations[i]
  );
}

 // Water

 const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

 water = new Water(
   waterGeometry,
   {
     textureWidth: 502,
     textureHeight: 502,
     waterNormals: new THREE.TextureLoader().load( 'assets/waternormals.jpg', function ( texture ) {

       texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

     } ),
     
     sunDirection: new THREE.Vector3(),
     sunColor: 0xffffff,
     waterColor: 0x001e0f,
     distortionScale: 3.7,
     fog: scene.fog !== undefined
   }
 );

 water.rotation.x = - Math.PI / 2;

 scene.add( water );


 const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


// Skybox
const sky = new Sky();
sky.scale.setScalar(10000);
scene.add(sky);

const skyUniforms = sky.material.uniforms;
skyUniforms['turbidity'].value = 10;
skyUniforms['rayleigh'].value = 2;
skyUniforms['mieCoefficient'].value = 0.005;
skyUniforms['mieDirectionalG'].value = 0.8;

const parameters = {
  elevation: 2,
  azimuth: 180,
};


const pmremGenerator = new THREE.PMREMGenerator(renderer);
const sun = new THREE.Vector3();

function updateSun() {
  const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
  const theta = THREE.MathUtils.degToRad(parameters.azimuth);
  console.log(sun);
  sun.setFromSphericalCoords(1, phi, theta);
  sky.material.uniforms['sunPosition'].value.copy(sun);
  water.material.uniforms['sunDirection'].value.copy(sun).normalize();
 
  scene.environment = pmremGenerator.fromScene(sky).texture;
} 

updateSun();

window.onload = () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height + 11,
  0.1,
  1000
);
camera.position.x = 15;
camera.position.y = 10;
camera.position.z = 70;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer

// camera

// resize
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.addEventListener("keydown", onDocumentKeyDown, false);
});
// end resize

////////////////////////////////////end camera and resize  ////////////////////////////////////////////

renderer.setClearColor("#87ceeb");
//renderer.setClearColor("#000000");



// document.addEventListener("keydown", function (event) {
//   if (event.key === "p") {
//     if (animationPaused) {
//       animationPaused = false;
//     }
//   }
// });

// function HalfMovement(ModelIndex, actionIndex) {
//   // في حال لم تصل الابواب لنصف الحركة
//   if (!animationPaused) {
//     mixers[ModelIndex].update(0.05);
//     const action = mixers[ModelIndex]._actions[actionIndex];
//     const clipDuration = action.getClip().duration; // حساب وقت الحركة كاملا
//     const currentTime = mixers[ModelIndex].time % clipDuration; // حساب الوقت الحالي
//     if (currentTime >= clipDuration / 2) {
//       // التأكد من وصول الحركة إلى نصف مدتها
//       action.paused = true; // توقيف الحركة في الموضع الحالي
//       animationPaused = true; // إيقاف حالة التشغيل
//     }
//   }
// }

var elapsedtime;
var oldElapsedTime;
var deltatime;
const clock = new THREE.Clock();

function animate() {
  setTimeout(function () {
    requestAnimationFrame(animate);
  }, 30);

  // elapsedtime
  elapsedtime = clock.getElapsedTime();
  deltatime = elapsedtime - oldElapsedTime;
  oldElapsedTime = elapsedtime;

  for (let i = 0; i < mixers.length; i++) {
    if (i == !0) mixers[i].update(deltatime);
    else HalfMovement(0, 0);
  }

  boat.update();
  models[0].position.x = boat.position.x;
  models[0].position.y = boat.position.y;
  models[0].position.z = boat.position.z;

  // console.log("position Boat", models[0].position);
  // console.log("position camera", camera.position);
  // رسم الاشعة
  // ...

  controls.update();
  renderer.render(scene, camera);
}

animate();

