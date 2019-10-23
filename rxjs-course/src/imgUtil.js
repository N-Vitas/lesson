import brain  from 'brain.js';
// computes center of mass of digit, for centering
// note 1 stands for black (0 white) so we have to invert.
export const centerImage = (img) => {
    let meanX = 0;
    let meanY = 0;
    const rows = img.length;
    const columns = img[0].length;
    let sumPixels = 0;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            const pixel = (1 - img[y][x]);
            sumPixels += pixel;
            meanY += y * pixel;
            meanX += x * pixel;
        }
    }
    meanX /= sumPixels;
    meanY /= sumPixels;

    const dY = Math.round(rows/2 - meanY);
    const dX = Math.round(columns/2 - meanX);
    return {transX: dX, transY: dY};
}

// given grayscale image, find bounding rectangle of digit defined
// by above-threshold surrounding
export const getBoundingRectangle = (img, threshold) => {
    const rows = img.length;
    const columns = img[0].length;
    let minX=columns;
    let minY=rows;
    let maxX=-1;
    let maxY=-1;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            if (img[y][x] < threshold) {
                if (minX > x) minX = x;
                if (maxX < x) maxX = x;
                if (minY > y) minY = y;
                if (maxY < y) maxY = y;
            }
        }
    }
    return { minY: minY, minX: minX, maxY: maxY, maxX: maxX};
}

// take canvas image and convert to grayscale. Mainly because my
// own functions operate easier on grayscale, but some stuff like
// resizing and translating is better done with the canvas functions
export const  imageDataToGrayscale = (imgData) => {
    const grayscaleImg = [];
    for (let y = 0; y < imgData.height; y++) {
        grayscaleImg[y]=[];
        for (let x = 0; x < imgData.width; x++) {
            const offset = y * 4 * imgData.width + 4 * x;
            const alpha = imgData.data[offset+3];
            // weird: when painting with stroke, alpha == 0 means white;
            // alpha > 0 is a grayscale value; in that case I simply take the R value
            if (alpha == 0) {
                imgData.data[offset] = 255;
                imgData.data[offset+1] = 255;
                imgData.data[offset+2] = 255;
            }
            imgData.data[offset+3] = 255;
            // simply take red channel value. Not correct, but works for
            // black or white images.
            grayscaleImg[y][x] = imgData.data[y*4*imgData.width + x*4 + 0] / 255;
        }
    }
    return grayscaleImg;
}

export const softmax = (output) => {
    const maximum = output.reduce((p,c) => { return p>c ? p : c; });
    const nominators = output.map((e) => Math.exp(e - maximum));
    const denominator = nominators.reduce((p, c) => (p + c));
    const softmax = nominators.map((e) => (e / denominator));

    let maxIndex = 0;
    softmax.reduce((p,c,i) => {if(p<c) {maxIndex=i; return c;} else return p;});

    const result = [];

    for (let i=0; i<output.length; i++)
    {
        if (i==maxIndex)
            result.push(1);
        else
            result.push(0);
    }

    return result;
}

export const net = () => {
    const net = new brain.NeuralNetwork();
    net.fromJSON(require('./data/mnistTrain.json'));
    net.myOutRun = input => {
        return softmax(net.runInput(input));
    }
    return net;
};