// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");
global.POSTPROCESSING = require("postprocessing");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor(0x000000, 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 0, 500);
  // camera.position.z = 500;
  camera.rotation.x = 1.16;
  camera.rotation.y = -0.12;
  camera.rotation.z = 0.26;

  // // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup lights
  const ambient = new THREE.AmbientLight(0x555555);
  scene.add(ambient);

  const directionalLight = new THREE.DirectionalLight(0xff8c19);
  directionalLight.position.set(0, 0, 1);
  scene.add(directionalLight);

  // let purpleLight = new THREE.PointLight(0x95708F,50,450,1.7);
  // purpleLight.position.set(200,300,100);
  // scene.add(purpleLight);
  
  // let greenLight = new THREE.PointLight(0xaccabb,50,450,1.7);
  // greenLight.position.set(100,300,100);
  // scene.add(greenLight);

  // let blueLight = new THREE.PointLight(0x5468FF,50,450,1.7);
  // blueLight.position.set(300,300,200);
  // scene.add(blueLight);

  let orangeLight = new THREE.PointLight(0xcc6600,50,450,1.7);
  orangeLight.position.set(200,300,100);
  scene.add(orangeLight);

  let redLight = new THREE.PointLight(0xd8547e,50,450,1.7);
  redLight.position.set(100,300,100);
  scene.add(redLight);
  
  let blueLight = new THREE.PointLight(0x3677ac,50,450,1.7);
  blueLight.position.set(300,300,200);
  scene.add(blueLight);

  // Setup additional lighting effects
  // const bloomEffect = new POSTPROCESSING.BloomEffect({
  //   blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
  //   kernelSize: POSTPROCESSING.KernelSize.SMALL,
  //   useLuminanceFilter: true,
  //   luminanceThreshold: 0.3,
  //   luminanceSmoothing: 0.75
  // });
  // bloomEffect.blendMode.opacity.value = 1.5;

  const cloudParticles = [];
  const stars = [];

//---------------------------------------------------------------------------------------------
// Method 2: TEXTURE LOADER WITH CALLBACKS
  
  const cloud02Loader = new THREE.TextureLoader();
  
  // Load a resource
  cloud02Loader.load(
    // Resource path
    "http://127.0.0.1:5500/assets/textures/cloud-02.png",

    // onLoad callback function
    function(texture) {
      // Create the geometry
      const cloud02Geometry = new THREE.PlaneBufferGeometry(500,500);
  
      // Create the material
      const cloud02Material = new THREE.MeshLambertMaterial({
        map : texture,
        transparent : true,
      });

      // Load clouds
      for (let i = 0; i < 50; i++) {
        let cloud02 = new THREE.Mesh(cloud02Geometry, cloud02Material);
        cloud02.position.set(
          random.range(-500,500),
          random.range(-200,200),
        );
        cloud02.rotation.z = random.range(0, 360);
        // cloud02.scale.set(.01,.01,.01);
        cloud02.material.opacity = 0.55;
        cloud02.material.side = THREE.DoubleSide;
        cloudParticles.push(cloud02)
        scene.add(cloud02);
      }
    },
    
    // onProgress callback currently not supported // I don't know what this is, it was in the docs
    undefined,
    
    // onError callback
    function(e) {
      console.log("ERROR LOADING CLOUD TEXTURE!!")
    }
  );

//---------------------------------------------------------------------------------------------
// ADD BACKGROUND STARS USING PARTICLES METHOD

  const particleCount = 1800;
  const particles = new THREE.Geometry();
  const particleLoader = new THREE.TextureLoader();

  particleLoader.load(
    "http://127.0.0.1:5500/assets/textures/particle.png",
    
    function(texture) {
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xa5e5ff, // 0x73d7ff 0x91e0ff 0xa5e5ff  "https://www.pinterest.com/pin/210121138851770530/"
        map: texture,
        size: random.range(5, 25), 
      });

      for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Vector3(
          random.range(-1000,1000),
          random.range(-1000,1000),
          random.range(-1000,1000)
        );
        
        particles.vertices.push(particle);
      }

      const particleSystem = new THREE.Points(particles, particleMaterial);
      scene.add(particleSystem);
    },

    undefined,

    function(e) {
      console.log("ERROR LOADING PARTICLES TEXTURE!!")
    }
  )

//---------------------------------------------------------------------------------------------
// RENDER

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      // controls.update();
      renderer.render(scene, camera);
      cloudParticles.forEach(p => {
        // p.rotation.z -=0.001;
      });
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      // controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);

//---------------------------------------------------------------------------------------------
// Method 1: TEXTURE LOADER - Works just fine

  // const texture = new THREE.TextureLoader().load(
  //   'http://127.0.0.1:5500/assets/textures/cloud-02.png'
  // );

  // const material = new THREE. MeshLambertMaterial({
  //   map: texture,
  //   transparent: true,
  // });

  // const geometry = new THREE.PlaneBufferGeometry(500,500);

  // for (let i = 0; i < 20; i++) {
  //   const cloud01 = new THREE.Mesh(geometry, material);
  //   cloud01.position.set(
  //     random.range(-500,500),
  //     random.range(-200,200),
  //   );
  //   cloud01.rotation.z = random.range(0, 360);
  //   // cloud01.scale.set(.01,.01,.01);
  //   cloud01.material.opacity = 0.6;
  //   cloudParticles.push(cloud01);
  //   scene.add(cloud01);
  // };
 
//---------------------------------------------------------------------------------------------
// ADD STARS FOR BACKGROUND USING METHOD 1

  // for (let i = 0; i< 500; i++) {
  //   const starGeometry = new THREE.SphereGeometry(random.range(0.1,1.2),8,6)
  //   const starMaterial = new THREE.MeshBasicMaterial({
  //     color: 0xffffff,
  //   });

  //   const star = new THREE.Mesh(starGeometry, starMaterial);
  //   star.position.set(
  //     random.range(-1000,1000),
  //     random.range(-700,700),
  //     random.range(-1000,500),
  //   );
  //   star.material.side = THREE.DoubleSide;

  //   const starBloom = new POSTPROCESSING.BloomEffect({

  //   });

  //   stars.push(star);
  //   scene.add(star);
  // };

//---------------------------------------------------------------------------------------------
// ADD STARS FOR BACKGROUND USING METHOD 2

  // const starLoader = new THREE.TextureLoader();
  
  // // Load a resource
  // starLoader.load(
  //   // Resource path
  //   "http://127.0.0.1:5500/assets/textures/particle.png",

  //   // onLoad callback function
  //   function(texture) {
  //     // Create the geometry
  //     const starGeometry = new THREE.SphereGeometry(random.range(0.1,1.2),8,6)
  
  //     // Create the material
  //     const starMaterial = new THREE.MeshLambertMaterial({
  //       color: 0xffffff,
  //       map : texture,
  //       transparent : true,
  //     });

  //     // Load stars
  //     for (let i = 0; i< 500; i++) {
  //       const star = new THREE.Mesh(starGeometry, starMaterial);
        
  //       star.material.opacity = 0.55;
  //       star.material.side = THREE.DoubleSide;
  //       star.position.set(
  //         random.range(-1000,1000),
  //         random.range(-700,700),
  //         random.range(-1000,500),
  //       );
  //       // star.rotation.z = random.range(0, 360);
  //       // star.scale.set(.01,.01,.01);
        
  //       stars.push(star)
  //       scene.add(star);
  //     }
  //   },
    
  //   // onProgress callback currently not supported // I don't know what this is, it was in the docs
  //   undefined,
    
  //   // onError callback
  //   function(e) {
  //     console.log("ERROR LOADING STAR TEXTURE!!")
  //   }
  // );
