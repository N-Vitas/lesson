import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vector, Ball } from './vector';

const visual = document.querySelector('#visual');
visual.width = 500;
visual.height = 300;
const x1 = document.querySelector('#x1');
const y1 = document.querySelector('#y1');
const x2 = document.querySelector('#x2');
const y2 = document.querySelector('#y2');
const collx2 = document.querySelector('#collx2');
const colly2 = document.querySelector('#colly2');
const color = document.querySelector('#color');
const range = document.querySelector('#range');
const addVector = document.querySelector('#addVector');
const context = visual.getContext('2d');
const vectors = new Array();
const click = fromEvent(addVector, 'click');
const stream = click.pipe(
    map(() => {
        return {
            x1: x1.value,
            y1: y1.value,
            x2: x2.value,
            y2: y2.value,
            collx2: collx2.value,
            colly2: colly2.value,
            r: range.value,
            c: color.value,
        }
    })
)

stream.subscribe(pos => {
    context.clearRect(0,0, 500, 300);
    const a = new Ball(5, pos.c, new Vector(pos.x1,pos.y1), new Vector(Math.random() - 0.5, Math.random() - 0.5), visual, context);
    const b = new Ball(5, pos.c, new Vector(pos.x2,pos.y2), new Vector(Math.random() - 0.5, Math.random() - 0.5), visual, context);
    // context.strokeStyle = pos.c;
    // context.lineWidth = pos.r;
    // context.beginPath()
    // context.moveTo(pos.x1,pos.y1);
    // context.lineTo(pos.x2,pos.y2);
    // context.closePath();
    // context.stroke();
    a.checkCollision(b);
    a.drawBall();
    b.drawBall();
})
