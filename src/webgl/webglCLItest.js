// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes")

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  const palette = random.pick(palettes) // add a variable for a random color palette
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });
  
  // WebGL background color
  renderer.setClearColor("#000", 1);
  
  // Setup a camera
  const camera = new THREE.OrthographicCamera();
  // const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100); // perspective camera
  // camera.position.set(2, 2, -4); // perspective camera settings
  // camera.lookAt(new THREE.Vector3()); // perspective camera settings
  
  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);
  
  // Setup your scene
  const scene = new THREE.Scene();
  
  // Setup a geometry
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
  
  // Setup a material
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: "red",
    wireframe: true
  });
  
  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  // mesh.position.set(
  //   random.range(-.05, .05), // changes position on the x-axis direction
  //   random.range(-.05, .05), // changes position on the y-axis direction
  //   random.range(-.05, .05) // changes position on the z-axis direction
  // );
  // mesh.scale.set(
  //   random.range(-.1, .1), // changes scale in x-axis direction
  //   random.range(-.1, .1), // changes scale in y-axis direction
  //   random.range(-.1, .1) // changes scale in z-axis direction
  // );
  // mesh.scale.multiplyScalar(0.01); // changes size of object
  // scene.add(mesh); // adds the 'mesh' object to the scene
      
  // Boxes / Cubes may be set up inside a for loop
  for (let i = 0; i < 40; i++) {
    const cubeGeometry = new THREE.BoxGeometry();
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: random.pick(palette),
      wireframe: false
    });
    const cube = new THREE.Mesh (cubeGeometry, cubeMaterial );
    cube.position.set(
      random.range(-.05, .05), // changes position on the x-axis direction
      random.range(-.05, .05), // changes position on the y-axis direction
      random.range(-.05, .05) // changes position on the z-axis direction
    );
    cube.scale.set(
      random.range(-.1, .1), // changes scale in x-axis direction
      random.range(-.1, .1), // changes scale in y-axis direction
      random.range(-.1, .1) // changes scale in z-axis direction
    );  
    cube.scale.multiplyScalar(0.25); // changes size of object
    scene.add(cube) // adds the 'cube' object to the scene
  };

  

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);

      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 0.1;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();

      // camera.aspect = viewportWidth / viewportHeight; // perspective camera settings
      // camera.updateProjectionMatrix(); // perspective camera settings
    },
    // Update & render your scene here
    render({ time }) {
      mesh.rotation.y = time * 0.1;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
