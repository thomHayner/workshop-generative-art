const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  suffix: random.getSeed(),
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  const palette = random.pick(palettes);
  const backgroundPlucker = random.rangeFloor(0,5);
  const backgroundColor = palette.splice(backgroundPlucker, backgroundPlucker + 1);
  const colorCount = random.rangeFloor(3, 6);
  const colorArray = random.shuffle(palette.slice(0, colorCount));

  const createGrid = () => {
    const points = [];
    const count = 30;
    
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v)*.2);
        points.push({
          color: random.pick(colorArray),
          radius,
          rotation: random.noise2D(u, v),
          position: [u, v]
        });
      }
    }
    return points;
  }
  
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 110;

  return ({ context, width, height }) => {
    context.fillStyle = backgroundColor; //'#858585';
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const {
        position,
        radius,
        color,
        rotation
      } = data;

      const [u, v] = position;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.save();
      
      // context.fillStyle = color;
      // context.font = `${radius * width}px "Helvetica"`;
      // context.translate(x, y);
      // context.rotate(rotation);
      // context.fillText("#", x, y);

      context.beginPath();
      context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      context.fillStyle = color;
      context.fill()
      
      context.restore();
    })
  };
};

canvasSketch(sketch, settings);
