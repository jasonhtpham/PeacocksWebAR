/// Zappar for ThreeJS Examples
/// Play animation from button tap

// In this image tracked example we load a 3D model that contains an animation
// that we'll play if the user taps on an on-screen button

import * as ZapparThree from '@zappar/zappar-threejs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import flowers from '../assets/bottom.png';
import flowerRight from '../assets/FlowerCorner.png';
import flowerLeft from '../assets/FlowerCorner.png';
import card from '../assets/CardGin.png';
import target from '../assets/LabelToUse.zpt';
import glass from '../assets/MartiniGlass.glb';
import videoSource from '../assets/martinivideoplayback.mp4';


import './index.sass';
import { MeshPhongMaterial } from 'three';

// The SDK is supported on many different browsers, but there are some that
// don't provide camera access. This function detects if the browser is supported
// For more information on support, check out the readme over at
// https://www.npmjs.com/package/@zappar/zappar-threejs
if (ZapparThree.browserIncompatible()) {
  // The browserIncompatibleUI() function shows a full-page dialog that informs the user
  // they're using an unsupported browser, and provides a button to 'copy' the current page
  // URL so they can 'paste' it into the address bar of a compatible alternative.
  ZapparThree.browserIncompatibleUI();

  // If the browser is not compatible, we can avoid setting up the rest of the page
  // so we throw an exception here.
  throw new Error('Unsupported browser');
}

// ZapparThree provides a LoadingManager that shows a progress bar while
// the assets are downloaded. You can use this if it's helpful, or use
// your own loading UI - it's up to you :-)
const manager = new ZapparThree.LoadingManager();

// Construct our ThreeJS renderer and scene as usual
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
document.body.appendChild(renderer.domElement);

// As with a normal ThreeJS scene, resize the canvas if the window resizes
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Create a Zappar camera that we'll use instead of a ThreeJS camera
const camera = new ZapparThree.Camera();

// In order to use camera and motion data, we need to ask the users for permission
// The Zappar library comes with some UI to help with that, so let's use it
ZapparThree.permissionRequestUI().then((granted) => {
  // If the user granted us the permissions we need then we can start the camera
  // Otherwise let's them know that it's necessary with Zappar's permission denied UI
  if (granted) camera.start();
  else ZapparThree.permissionDeniedUI();
});

// The Zappar component needs to know our WebGL context, so set it like this:
ZapparThree.glContextSet(renderer.getContext());

// Set the background of our scene to be the camera background texture
// that's provided by the Zappar camera
scene.background = camera.backgroundTexture;

// Set an error handler on the loader to help us check if there are issues loading content.
manager.onError = (url) => console.log(`There was an error loading ${url}`);

// Create a zappar image_tracker and wrap it in an image_tracker_group for us
// to put our ThreeJS content into
// Pass our loading manager in to ensure the progress bar works correctly
const imageTracker = new ZapparThree.ImageTrackerLoader(manager).load(target);
const imageTrackerGroup = new ZapparThree.ImageAnchorGroup(camera, imageTracker);

// Add our image tracker group into the ThreeJS scene
scene.add(imageTrackerGroup);

// Since we're using webpack, we can use the 'file-loader' to make sure these assets are
// automatically included in our output folder

let action: THREE.AnimationAction;
let mixer: THREE.AnimationMixer;

var loader = new THREE.TextureLoader();

// Load an image file into a custom material
var materialBottom = new THREE.MeshLambertMaterial({
  map: 
  loader.load(flowers),
  transparent:true
});


// Build a plane with similar shape with the label to become a main mesh
const hexagonShape = new THREE.Shape();
hexagonShape.moveTo(-0.6, -0.8);
hexagonShape.lineTo(-0.6, 0.8);
hexagonShape.lineTo(0, -1);

hexagonShape.moveTo(-0.6, 0.8);
hexagonShape.lineTo(0, 1);

hexagonShape.moveTo(0, 1);
hexagonShape.lineTo(0.6, 0.8);

hexagonShape.moveTo(0.6, 0.8);
hexagonShape.lineTo(0.6, -0.8);

hexagonShape.moveTo(0.6, -0.8);
hexagonShape.lineTo(0, -1);

const mainGeometry = new THREE.ShapeGeometry(hexagonShape);

const mainMaterial = new THREE.MeshBasicMaterial({ color: '#d5cef0' });

// combine our image geometry and material into a mesh
const mainMesh = new THREE.Mesh(mainGeometry, mainMaterial);

// set the position of the image mesh in the x,y,z dimensions
mainMesh.position.set(0, 0, 0.01);

// add the image to the scene
// scene.add(mesh);

imageTrackerGroup.add(mainMesh);




// Video player
// Create a video element with local mp4/obv file.
const video = document.createElement('video');
video.src = videoSource;

// load video
video.load();

// make your video canvas
const videoCanvas = document.createElement('canvas');
videoCanvas.id = ('videoCanvas');
// set its size
videoCanvas.width = 1280;
videoCanvas.height = 720;

// Provide videoCanvas with 2d context
const videoCanvasCtx = videoCanvas.getContext('2d');

// draw a black rectangle so that the canvas don't start out transparent
if (videoCanvasCtx !== null) {
  videoCanvasCtx.fillStyle = '#000000';
  videoCanvasCtx.fillRect(0, 0, 1280, 720);
}

// Use canvas as the texture
const texture = new THREE.Texture(videoCanvas);

// configure the material for the mesh
const videoMaterial = new THREE.MeshLambertMaterial({
  map:
    texture,
  side: THREE.FrontSide,
  toneMapped: false,
});

// create a plane geometry for the video
const videoGeometry = new THREE.PlaneGeometry(1, 0.75);

// Put material and the plane together to have a mesh
const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
videoMesh.position.set(0, 0, 0.2);

imageTrackerGroup.add(videoMesh);




// create a plane geometry for the image with a width of 10
// and a height that preserves the image's aspect ratio
var geometryBottom = new THREE.PlaneGeometry(0.8, 0.8);

// combine our image geometry and material into a mesh
var meshBottom = new THREE.Mesh(geometryBottom, materialBottom);

// set the position of the image mesh in the x,y,z dimensions
meshBottom.position.set(0,-1,0.1)

// add the image to the scene
//scene.add(mesh);
imageTrackerGroup.add(meshBottom);

//right side flower
// Load an image file into a custom material
var materialRight = new THREE.MeshLambertMaterial({
  map: 
  loader.load(flowerRight),
  transparent:true
});

// create a plane geometry for the image with a width of 10
// and a height that preserves the image's aspect ratio
var geometryRight = new THREE.PlaneGeometry(0.8, 0.8);

// combine our image geometry and material into a mesh
var meshRight = new THREE.Mesh(geometryRight, materialRight);

// set the position of the image mesh in the x,y,z dimensions
meshRight.position.set(0.6,0,0.1)

// add the image to the scene
imageTrackerGroup.add(meshRight);

//right side flower
// Load an image file into a custom material
var materialLeft = new THREE.MeshLambertMaterial({
  map: 
  loader.load(flowerLeft),
  transparent:true
});

// create a plane geometry for the image with a width of 10
// and a height that preserves the image's aspect ratio
var geometryLeft = new THREE.PlaneGeometry(0.8, 0.8);

// combine our image geometry and material into a mesh
var meshLeft = new THREE.Mesh(geometryLeft, materialLeft);

// set the position of the image mesh in the x,y,z dimensions
meshLeft.position.set(-0.6,0,0.1)

// add the image to the scene
imageTrackerGroup.add(meshLeft);


//card
// Load an image file into a custom material
var materialCard = new THREE.MeshLambertMaterial({
  map: 
  loader.load(card),
  transparent:true
});

// create a plane geometry for the image with a width of 10
// and a height that preserves the image's aspect ratio
var geometryCard = new THREE.PlaneGeometry(2.3, 2.4);

// combine our image geometry and material into a mesh
var meshCard = new THREE.Mesh(geometryCard, materialCard);

// set the position of the image mesh in the x,y,z dimensions
meshCard.position.set(-2.0,-2,0.1)
meshCard.rotation.set(0,0.7,0.1)

// add the image to the scene
//scene.add(mesh);
imageTrackerGroup.add(meshCard);
/*
//Glass
// Load an image file into a custom material
var materialGlass = new THREE.MeshLambertMaterial({
  map: 
  loader.load(glass),
  transparent:true
});

// create a plane geometry for the image with a width of 10
// and a height that preserves the image's aspect ratio
var geometryGlass = new THREE.PlaneGeometry(1.5, 1.5);

// combine our image geometry and material into a mesh
var meshGlass = new THREE.Mesh(geometryGlass, materialGlass);

// set the position of the image mesh in the x,y,z dimensions
meshGlass.position.set(2.0,-1.5,0)
meshGlass.rotation.set(0,-0.7,0)

// add the image to the scene
//scene.add(mesh);
imageTrackerGroup.add(meshGlass);


*/

//Glass3dModel
// Load a 3D model to place within our group (using ThreeJS's GLTF loader)
const gltfLoader = new GLTFLoader(manager);
gltfLoader.load(glass, (gltf) => {
  // Position the loaded content to overlay user's face
  gltf.scene.position.set(2.0,-2,0.1);
  gltf.scene.scale.set(2,2,2);
  gltf.scene.rotation.set(0,-0.7,0)


  
  /* get the animation and re-declare mixer and action.
  // which will then be triggered on button press
  mixer = new THREE.AnimationMixer(gltf.scene);
  action = mixer.clipAction(gltf.animations[0]);
  
  */
  // Now the model has been loaded, we can roate it and add it to our image_tracker_group
  imageTrackerGroup.add(gltf.scene);
}, undefined, () => {
  console.log('An error ocurred loading the GLTF model');
});


imageTrackerGroup.add(new THREE.DirectionalLight(0xffffff,10));

imageTrackerGroup.add(new THREE.AmbientLight(0xffffff,1));


// Create a new div element on the document
const button = document.createElement('div');

button.setAttribute('class', 'circle');

// On click, play the gltf's action
button.onclick = () => { action.play(); };

// Append the button to our document's body
document.body.appendChild(button);

// Create a button for video playing control
const videoButton = document.createElement('button');
videoButton.disabled = true;

videoButton.setAttribute('class', 'circle');

document.body.appendChild(videoButton);

// On click, play the video
videoButton.onclick = () => {
  video.play();
};

// When we lose sight of the camera, hide the scene contents.
// When we lose sight of the camera, hide the scene contents.
// Also, disable play button and pause video
imageTracker.onVisible.bind(() => {
  scene.visible = true;
  videoButton.disabled = false;
});
imageTracker.onNotVisible.bind(() => {
  scene.visible = false;
  videoButton.disabled = true;
  video.pause();
});
// Used to get deltaTime for our animations.
const clock = new THREE.Clock();



// Use a function to render our scene as usual
function render(): void {
  // If the mixer has been declared, update our animations with delta time
  if (mixer) mixer.update(clock.getDelta());

  // The Zappar camera must have updateFrame called every frame
  camera.updateFrame(renderer);


  // check for vid data
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    // draw video to canvas starting from upper left corner
    if (videoCanvasCtx !== null) {
      videoCanvasCtx.drawImage(video, 0, 0.2);
    }
    // tell texture object it needs to be updated
    texture.needsUpdate = true;
  }

  // Draw the ThreeJS scene in the usual way, but using the Zappar camera
  renderer.render(scene, camera);

  // Call render() again next frame
  requestAnimationFrame(render);
}

// Start things off
render();