import { fromEvent } from 'rxjs';
import { createInput, customContext, rgbToHex } from './canvas';
import { map, pairwise, switchMap, takeUntil, withLatestFrom, startWith } from 'rxjs/operators';
import { Layer, Network, Architect } from 'synaptic';
import { saveAs } from 'file-saver';

const canvas = document.querySelector('#canvas');
const neural = document.querySelector('#neural');
const double = document.querySelector('#double');
const clear = document.querySelector('#clear');
const names = ['ziro_','one_','two_','tree_','four_','five_','six_','seven_','eight_','nine_'];

const ctxn = customContext(neural);
const ctxc = customContext(canvas);
const cli = fromEvent(double, 'click');
const cliclear = fromEvent(clear, 'click');

const stream = cli.pipe(
    map(e => ctxc.getImageData(0, 0, 200, 200).data)
);
const imgData = (ctx) => {
    const d = ctx.getImageData(0, 0, 25, 25).data;
    let sum = 0;
    const px = [];
    d.forEach((element, index) => {
        if((index % 4) === 3 && sum > 0){
            px.push(1);
            sum = 0;
            return;
        }
        if((index % 4) === 3 && sum === 0){
            px.push(0);
            sum = 0;
            return;
        }
        sum += element;
    });
    return px;
}
const getTrainerData = new Promise((resolve) => {
    const data = [];
    for (let i=0; i<10; i++){
        for (let j=0; j<11; j++){
            const img = new Image();
            img.src = `src/img/${names[i]}${j}.png`;
            img.onload = () => {
                ctxn.drawImage(img, 0,0,25, 25);
                const item = {
                    in: imgData(ctxn),
                    out: [0,0,0,0,0,0,0,0,0,0],
                }
                item.out[i] = 1;
                data.push(item)
                ctxn.clearRect(0,0,25,25);
                if(i === 9 && j === 10) {
                    resolve(data);
                }
            }
        }
    }
})
// create the network
const createNeuralNetwork = () => {
    // const inputLayer = new Layer(625);
    // const h1 = new Layer(350);
    // const h2 = new Layer(100);
    // const h3 = new Layer(50);
    // const outputLayer = new Layer(10);
    
    // inputLayer.project(h1);
    // h1.project(h2);
    // h2.project(h3);
    // h3.project(outputLayer);
    // // const myNetwork = Architect.Perceptron(625,350,100,50,10);
    // const myNetwork = new Network({
    //     input: inputLayer,
    //     hidden: [h1, h2, h3],
    //     output: outputLayer
    // });

    getTrainerData.then(db => {
        // const learningRate = .3;
        // for (let i = 0; i < 20000; i++){
        const data = [];
        db.forEach(item => {
            if(item.in.length === 625 && item.out.length === 10) {
                data.push(item);
                // myNetwork.activate(item.in);
                // myNetwork.propagate(learningRate, item.out);
            }
        })
        // var fs = require("file-system");
        // fs.writeFile("datatrainer.json", JSON.stringify(data), (err) => {
        //     if (err) {
        //         console.error(err);
        //         return;
        //     };
        //     console.log("File has been created");
        // });
        // }
        // console.log('Сеть готова');
        // console.log('myNetwork activate', myNetwork.activate(db[0].in));
        // console.log('myNetwork result', db[0].out);
    })
    // return myNetwork;
}
// const myPerceptron = createNeuralNetwork();
let s = 0;
stream.subscribe(pos => {
    // const p = ctx.getImageData(pos.x, pos.y, 1, 1).data;
    // const hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    
    const img = new Image();
    img.src = `src/img/${names[s]}9.png`;
    img.onload = () => {
        ctxn.clearRect( 0, 0, 200, 200);
        ctxn.drawImage(img, 0, 0, 200, 200);
        const d = ctxn.getImageData(0, 0, 200, 200).data;
        let sum = 0;
        const px = [];
        d.forEach((element, index) => {
            if((index % 4) === 3 && sum > 0){ 
                px.push(1);
                sum = 0;
                return;
            }
            if((index % 4) === 3 && sum === 0){
                px.push(0);
                sum = 0;
                return;
            }
            sum += element;
        });
        // console.log('drawImage', px); 
    };
    s++;
    if(s === 10) { s = 0;}
    // .then(db => console.log('drawImage', getTrainerData));

    // pos.forEach((element, index) => {
    //     if(element > 0)
    //     console.log('drawImage', index, element); 
    // });
})
cliclear.subscribe(() => {
    ctxc.clearRect(0,0,200,200);
    ctxn.clearRect(0,0,200,200);
})