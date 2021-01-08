const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');


const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  
  const gridBuilder = () => {
    const innerPoints = [];
    
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const u = (x / (gridSize - 1));
        const v = y / (gridSize - 1);
        innerPoints.push([ u, v ])
      }
    };
    return innerPoints
  }
  
  const rondomPointSelector = () => {
    const innerRandomizedPoints = [];
    const max = tempArr.length / 2
    const arrClone = [...tempArr] 
    
    // if (!arrClone) {setTimeout(()=> {if (innerRandomizedPoints.length !== max) {
    //   }
    // }, 1000)}
    
    for (let x = 0; x < max; x += 2) {
      const first = arrClone[0][1];
      const second = arrClone[1][1];
      
      if (first !== second) {
        innerRandomizedPoints.push([ arrClone.shift(), arrClone.shift()]);
        x -= 1
      }
      if (first === second) {
        const newIndex = arrClone.findIndex((a) => a[1] !== first) || 1 ;
        const newSecond = arrClone.splice(newIndex, newIndex + 1);
        innerRandomizedPoints.push([ arrClone.shift(), newSecond ]);
      };
    };
    
    // return randomPointSelector(tempArr)
    // if (innerRandomizedPoints.length !== max) {
    //   return randomPointSelector(tempArr)
    // }
    console.log('arrClone')
    console.log(arrClone)
    return innerRandomizedPoints.sort((a, b) => ((a[0][1]+a[1][1]) / 2) - ((b[0][1]+b[1][1]) / 2))
  }
  
  const gridSize = 6;
  const points = gridBuilder();
  // const tempArr = random.shuffle(points.filter(([ x, y ]) => y !== 1));
  const tempArr = random.shuffle(points.filter((a) => a[1] !== 1));

  console.log("tempArr Pre")
  console.log(tempArr)

  const sortedRandomizedPoints = rondomPointSelector();
  const backgroundColor = "white";
  
  console.log("tempArr Post")
  console.log(tempArr)
  console.log("sortedRandomizedPoints")
  console.log(sortedRandomizedPoints)

  return ({ context, width, height }) => {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);

    points.forEach(([ u, v ]) => {
      const x = u * (width - (width / gridSize)) + ((width / gridSize) * 0.5);
      const y = v * (height - (width / gridSize)) + ((width / gridSize) * 0.5);

      context.beginPath();
      context.arc(x, y, 1, 0, Math.PI * 2, false);
      context.fillStyle = "black";
      context.fill()
    })

    sortedRandomizedPoints.forEach(([[ s, t ], [ u, v ]]) => {
      const x1 = s * (width - (width / gridSize)) + ((width / gridSize) * 0.5);
      const y1 = t * (height - (width / gridSize)) + ((width / gridSize) * 0.5);
      const x2 = u * (width - (width / gridSize)) + ((width / gridSize) * 0.5);
      const y2 = v * (height - (width / gridSize)) + ((width / gridSize) * 0.5);

      context.beginPath();
      context.lineWidth = 10;
      context.moveTo(x1, (width / gridSize) * 0.5);
      context.lineTo(x1, y1);
      context.lineTo(x2, y2);
      context.lineTo(x2, width - ((width / gridSize) * 0.5));
      context.lineTo(x1, width - ((width / gridSize) * 0.5));
      context.fillStyle = random.pick(random.pick(palettes))
      context.fill();
      context.strokeStyle = backgroundColor;
      context.stroke();
    })
  }
};

canvasSketch(sketch, settings);
