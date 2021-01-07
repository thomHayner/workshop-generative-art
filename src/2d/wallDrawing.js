const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');


const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  
  const gridBuilder = () => {
    const points = [];
    
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const u = (x / (gridSize - 1));
        const v = y / (gridSize - 1);
        points.push([ u, v ])
      }
    };

    return points
  }
  
  const rondomPointSelector = (arr) => {
    const randomizedPoints = [];
    const tempArr = random.shuffle(arr.filter(([ x, y ]) => y !== 1));

    for (let x = 0; x < arr.length / 2; x++) {
      randomizedPoints.push([ tempArr.shift(), tempArr.pop()])
    }
    return randomizedPoints
  }
  
  const gridSize = 6
  const points = gridBuilder();
  const randomizedPoints = rondomPointSelector(points)
  const color = random.pick(random.pick(palettes));

  console.log(randomizedPoints)

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(([ u, v ]) => {
      const x = u * (width - (width / gridSize)) + ((width / gridSize) * 0.5);
      const y = v * (height - (width / gridSize)) + ((width / gridSize) * 0.5);

      context.beginPath();
      context.arc(x, y, 10, 0, Math.PI * 2, false);
      context.fillStyle = "black";
      context.fill()
    })

    randomizedPoints.forEach(([[ s, t ], [ u, v ]]) => {
      const x1 = s * (width - (width / gridSize)) + ((width / gridSize) * 0.5);
      const y1 = t * (height - (width / gridSize)) + ((width / gridSize) * 0.5);
      const x2 = u * (width - (width / gridSize)) + ((width / gridSize) * 0.5);
      const y2 = v * (height - (width / gridSize)) + ((width / gridSize) * 0.5);

      context.beginPath();
      context.lineWidth = 5;
      context.moveTo(x1, (width / gridSize) * 0.5);
      context.lineTo(x1, y1);
      context.lineTo(x2, y2);
      context.lineTo(x2, width - ((width / gridSize) * 0.5));
      context.lineTo(x1, width - ((width / gridSize) * 0.5));
      context.fillStyle = random.pick(random.pick(palettes))
      context.fill();
      context.strokeStyle = "white";
      context.stroke();
    })
  }
};

canvasSketch(sketch, settings);
