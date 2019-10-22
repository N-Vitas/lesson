import { fromEvent, Subject, interval } from 'rxjs';
import { createInput, customContext, rgbToHex } from './canvas';
import { map, take, scan, pairwise, switchMap, takeUntil, withLatestFrom, startWith } from 'rxjs/operators';
import { Layer, Network, Architect } from 'synaptic';
import { saveAs } from 'file-saver';

const canvas = document.querySelector('#canvas');
const neural = document.querySelector('#neural');
const double = document.querySelector('#double');
const clear = document.querySelector('#clear');
const code = document.querySelector('#code');
const names = ['ziro_','one_','two_','tree_','four_','five_','six_','seven_','eight_','nine_'];

const ctxn = customContext(neural);
const ctxc = customContext(canvas);
const cli = fromEvent(double, 'click');
const cliclear = fromEvent(clear, 'click');
const stream = cli.pipe(
    map(e => ctxc.getImageData(0, 0, 200, 200).data)
);
const addNeural = new Subject().pipe(
    scan((acc,v) => acc.concat(v), [])
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
const getTrainerData = () => {
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
                data.push(item);
                addNeural.next(item);
                ctxn.clearRect(0,0,25,25);
            }
        }
    }
}

const setNumber = index => {
    const img = new Image();
    img.src = `src/img/${names[index]}0.png`;
    img.onload = () => {
        ctxn.clearRect(0, 0, 200, 200);
        ctxn.drawImage(img, 0, 0, 200, 200);
    }
}

const queryNeuralNetwork = () => {
        const group1 = () => {
            const a = document.querySelector('input[name=group1]:checked').value;
            return [0,0,0,0,0,0,0,0,0,0].map((i,k)=>{
                if(k == a){
                    return 1;
                }
                return i;
            });
        }
        const item = {
            in: imgData(ctxn),
            out: group1(),
        }
        let m = 0;
        item.in.forEach(l => m += l)
        if(m == 0){
            console.log('Cancel sum', m);
            return;
        }
        code.innerHTML = JSON.stringify(item);
        const xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", res => {
            if (res.target.readyState === 4) {
                const r = JSON.parse(res.target.responseText)
                let b = {num: 0, index: 0};
                r.out.forEach((item, index) => {
                    console.log('select', b.num, item, index);
                    if(b.num < item){
                        b.num = item
                        b.index = index;
                    }
                })
                console.log('out', r.out);
                setNumber(b.index);
            }
        });
        xhr.open("POST", "http://127.0.0.1:3000/");
        xhr.setRequestHeader("Content-Type", "application/json");    
        xhr.send(JSON.stringify(item));
    // }
}
// create the network
const createNeuralNetwork = (data) => {      
    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", () => {
    if (this.readyState === 4) {
        console.log(this.responseText);
    }
    });
    
    xhr.open("POST", "http://127.0.0.1:3000/");
    xhr.setRequestHeader("Content-Type", "application/json");    
    xhr.send(JSON.stringify(data));
}
let s = 0;
stream.subscribe(() => {
    // const p = ctx.getImageData(pos.x, pos.y, 1, 1).data;
    // const hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    const a = document.querySelector('input[name=group1]:checked').value;
    const img = new Image();
    img.src = `src/img/${names[a]}0.png`;
    img.onload = () => {
        ctxn.clearRect( 0, 0, 200, 200);
        ctxn.drawImage(img, 0, 0, 25, 25);
        queryNeuralNetwork();
    };
})
cliclear.subscribe(() => {
    ctxc.clearRect(0,0,200,200);
    ctxn.clearRect(0,0,200,200);
    // getTrainerData(addNeural.next.bind(this))
})
addNeural.subscribe(item => {
    if (item.length >= 110) {
        interval(1000).pipe(
            take(item.length),
            map(v => item[v]),
        ).subscribe(createNeuralNetwork)
    }
})
