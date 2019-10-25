import { fromEvent, Subject } from 'rxjs';
import { rgbToHex, customContext } from './canvas';
import { imageDataToGrayscale, getBoundingRectangle, centerImage, net } from './imgUtil'
const network = net();
const canvas = document.querySelector('#canvas');
const neural = document.querySelector('#neural');
const double = document.querySelector('#double');
const visual = document.querySelector('#visual');
const clear = document.querySelector('#clear');
const names = ['ziro_','one_','two_','tree_','four_','five_','six_','seven_','eight_','nine_'];

const ctxn = customContext(neural);
const ctxc = customContext(canvas);
const ctxv = customContext(visual);
const stream = fromEvent(double, 'click');
const cliclear = fromEvent(clear, 'click');
const stv = new Subject();

const setNumber = index => {
    const img = new Image();
    img.src = `src/img/${names[index]}0.png`;
    img.onload = () => {
        ctxc.clearRect(0, 0, 280, 280);
        ctxc.drawImage(img, 0, 0, 280, 280);
    }
}
const queryNeuralNetwork = (nnInput) => {
        const output = network.myOutRun(nnInput);
        let maxIndex = 0;
        output.reduce(function(p,c,i){if(p<c) {maxIndex=i; return c;} else return p;});
        setNumber(maxIndex);
        stv.next(network.outputs);
}
const newCanvas = (width, height, boundingRectangle, trans) => {
    const canvasCopy = document.createElement("canvas");
    canvasCopy.width = width;
    canvasCopy.height = height;
    const copyCtx = canvasCopy.getContext("2d");
    const brW = boundingRectangle.maxX+1-boundingRectangle.minX;
    const brH = boundingRectangle.maxY+1-boundingRectangle.minY;
    const scaling = 190 / (brW>brH?brW:brH);
    // scale
    copyCtx.translate(canvas.width/2, canvas.height/2);
    copyCtx.scale(scaling, scaling);
    copyCtx.translate(-canvas.width/2, -canvas.height/2);
    // translate to center of mass
    copyCtx.translate(trans.transX, trans.transY);
    return copyCtx;
}
stream.subscribe(() => {
    ctxn.clearRect( 0, 0, 280, 280);
    const id = ctxc.getImageData(0, 0, 280, 280)
    let grayscaleImg = imageDataToGrayscale(id);
    const nnInput = new Array(784);
    const nnInput2 = [];
    const b = getBoundingRectangle(grayscaleImg, 0.01);
    const t = centerImage(grayscaleImg);

    const copyCtx = newCanvas(id.width, id.height, b, t);
    copyCtx.drawImage(ctxc.canvas, 0, 0);
    const imgData = copyCtx.getImageData(0, 0, 280, 280);
    grayscaleImg = imageDataToGrayscale(imgData);
    for (let y = 0; y < 28; y++) {
        for (let x = 0; x < 28; x++) {
            let mean = 0;
            for (let v = 0; v < 10; v++) {
                for (let h = 0; h < 10; h++) {
                    mean += grayscaleImg[y*10 + v][x*10 + h];
                }
            }
            mean = (1 - mean / 100); // average and invert
            nnInput[x*28+y] = (mean - .5) / .5;
        }
    }
    const thumbnail =  ctxn.getImageData(0, 0, 28, 28);
    ctxc.clearRect(0, 0, canvas.width, canvas.height);
    ctxc.drawImage(copyCtx.canvas, 0, 0);
    for (let y = 0; y < 28; y++) {
        for (let x = 0; x < 28; x++) {
            const block = ctxc.getImageData(x * 10, y * 10, 10, 10);
            const newVal = 255 * (0.5 - nnInput[x*28+y]/2);
            nnInput2.push(Math.round((255-newVal)/255*100)/100);
            thumbnail.data[(y*28 + x)*4] = newVal;
            thumbnail.data[(y*28 + x)*4 + 1] = newVal;
            thumbnail.data[(y*28 + x)*4 + 2] = newVal;
            thumbnail.data[(y*28 + x)*4 + 3] = 255;
        }
    }
    ctxn.putImageData(thumbnail, 0, 0);
    queryNeuralNetwork(nnInput2);
})
cliclear.subscribe(() => {
    ctxc.clearRect(0,0,280,280);
    ctxn.clearRect(0,0,280,280);
    // ctxv.clearRect(0,0, 500, 300);
})
stv.subscribe(o => {
    const d1 = o[0].length / 495;
    const d2 = 495 / o[1].length;
    const d3 = 495 / o[2].length;
    const center = 50;
    const bottom = 270;
    o[1].forEach((e,i) => {
        createCeil({ 
            x: (d2 * i) + (d2 / 2),
            y: center,
            d: d2 / 2,
            c: `#${('00000'+(rgbToHex((230 * e) % 255,(166 * e) % 255,(153 * e) % 255)).toString(16)).slice(-6)}`
        });
    });
    o[2].forEach((e,i) => {
        o[1].forEach((e,j) => {
            createLine({ 
                x1: (d2 * j) + (d2 / 2),
                y1: center,
                x2: (d3 * i) + (d3 / 2),
                y2: bottom,
                c: `#${('00000'+(rgbToHex((230 * e) % 255,(1 * e) % 255,(1 * e) % 255)).toString(16)).slice(-6)}`
            });
        });
        createCeil({ 
            x: (d3 * i) + (d3 / 2),
            y: bottom,
            d: d3 / 2,
            c: `#${('00000'+(rgbToHex((230 * e) % 255,(1 * e) % 255,(1 * e) % 255)).toString(16)).slice(-6)}`
        });
    });
});

const createCeil = options => {
    const { x, y, d, c } = options;
    ctxv.fillStyle = c;
    // ctxv.lineCap='round';
    ctxv.beginPath()
    ctxv.arc(x,y,d,0,Math.PI*2,true);
    ctxv.fill();
}
const createLine = options => {
    const { x1, y1, x2, y2, c } = options;
    ctxv.strokeStyle = c;
    ctxv.lineWidth = 0.05;
    ctxv.beginPath()
    ctxv.moveTo(x1,y1);
    ctxv.lineTo(x2,y2);
    ctxv.closePath();
    ctxv.stroke();
}