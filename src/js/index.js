import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);;
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(1, 2.5, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );

const ambientLight = new THREE.AmbientLight( 0xffffff, 1.1 );
scene.add( ambientLight );

const spotLight = new THREE.SpotLight( 0xffffff, 1 );
spotLight.position.set( 0, 9, 0);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.5;
spotLight.castShadow = true;

scene.add( spotLight );
scene.add( spotLight.target );

const planeGeometry = new THREE.PlaneGeometry( 200, 100 );
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x4CAF50 });
const plane = new THREE.Mesh( planeGeometry, planeMaterial );

plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;

let model;
let mixer;
let isWalking = true;

scene.add( plane );

const loader = new GLTFLoader();
loader.load('../assets/barney_animated__rigged/scene.gltf', function (gltf) {
  model = gltf.scene;
  model.scale.set(0.05, 0.05, 0.05);
  model.position.y = 0.3
  
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
    }
  });

  mixer = new THREE.AnimationMixer( model );

  if(isWalking == true){
    mixer.clipAction(gltf.animations[0]).play();
  }
  
  scene.add(model);
});

function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  
  if (mixer) mixer.update(0);

  if (model) {
    model.position.x -= 0.0 * Math.sin(model.rotation.y) * -1;
    model.position.z += 0.0 * Math.cos(model.rotation.y);

    spotLight.target = model;
  }
}
animate();

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'a':
      model.rotation.y += 0.1;
      break;
    case 'd':
      model.rotation.y -= 0.1;
      break;
    case 'w':
      model.position.x -= 0.06 * Math.sin(model.rotation.y) * -1;
      model.position.z += 0.06 * Math.cos(model.rotation.y);
      mixer.update(0.02);
      break;
    case 's':
      model.position.x += 0.06 * Math.sin(model.rotation.y) * -1;
      model.position.z -= 0.06 * Math.cos(model.rotation.y);
      mixer.update(-0.02);
      break;
  }
});

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}, false);