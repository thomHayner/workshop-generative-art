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
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // Color palette
  const palette = random.pick(palettes)

  // WebGL background color
  renderer.setClearColor(palette[4], 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  // const geometry = new THREE.BoxGeometry(.010, .010, .010);

  // Setup a material
  // const material = new THREE.MeshBasicMaterial({
  //   color: 0x000000,
  //   wireframe: false,
  // });

  // Setup a mesh with geometry + material
  // const pointCube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  const pointsCoords = []

  // Setup a for loop to create mesh objects at each of 50 random points
  for (let i = 0; i < 16; i++) {
    const cubeGeometry = new THREE.SphereGeometry( 1, 3, 2, 6.1, 0, 3.1 );
    
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000, // "white", //palette[random.range(0, 3)],
      wireframe: false,
    });

    const pointCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    pointCube.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1),
    );

    pointsCoords.push(pointCube.position);
    scene.add(pointCube);
  }

  // Setup a for loop to create straight lines between each of the 50 random points
  for (let i = 0; i < pointsCoords.length; i++) {
    const startPoint = pointsCoords[i];

    for (let j = 0; j < pointsCoords.length; j++) {
      const endPoint = pointsCoords[j];
      const points = [];
      points.push(startPoint);
      points.push(endPoint);

      const lineMaterial = new THREE.LineBasicMaterial({
        color: palette[random.range(0,3)], // 0x000000,
        linewidth: 0.05,
      });
      const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );

      const line = new THREE.Line( lineGeometry, lineMaterial );
      scene.add( line );
    }
  }


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
      scene.rotation.set( 
        time * .1, 
        time * .1,
        time * .1
      )
      // scene.rotation.x =  time;
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
