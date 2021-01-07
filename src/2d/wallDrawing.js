const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  const gridSize = 6

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
  
  const points = gridBuilder();
  const margin = 400;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(([ u, v ]) => {
      const x = (u * (width - margin)) + (margin * 0.5);
      const y = v * (height - margin) + (margin * 0.5);

      context.beginPath();
      context.arc(x, y, 5, 0, Math.PI * 2, false);
      context.fillStyle = "black";
      context.fill()
    })
  }
};

canvasSketch(sketch, settings);
