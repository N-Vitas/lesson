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
})
stv.subscribe(o => {
    console.log(o);
    createCeil();
});

const createCeil = () => {
    const clr = rgbToHex(38,166,153);
    console.log(clr);
    ctxv.lineWidth = 1;
    ctxv.strokeStyle = `#${clr}`;
    ctxv.fillStyle = `#${clr}`;
    ctxv.lineCap='round';
    ctxv.beginPath()
    ctxv.arc(75,75,50,0,Math.PI*2,true);
    ctxv.fill(); // *14
    ctxv.moveTo(40, 140);
    ctxv.lineTo(20, 40);
    ctxv.lineTo(60, 100);
    ctxv.lineTo(80, 20);
    ctxv.lineTo(100, 100);
    ctxv.lineTo(140, 40);
    ctxv.lineTo(120, 140);
    ctxv.closePath()
    ctxv.stroke()
    // ctxv.fill()
}