import { fromEvent } from 'rxjs';
import { createInput, customContext, rgbToHex } from './canvas';
import { map, pairwise, switchMap, takeUntil, withLatestFrom, startWith } from 'rxjs/operators';

const canvas = document.querySelector('#canvas');
const neural = document.querySelector('#neural');
const random = document.querySelector('#random');
const ctxn = customContext(neural);
const ctxc = customContext(canvas);
const cli = fromEvent(random, 'click');

const stream = cli.pipe(
    map(e => ctxc.getImageData(0, 0, 200, 200).data)
);


stream.subscribe(pos => {
    // const p = ctx.getImageData(pos.x, pos.y, 1, 1).data;
    // const hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    ctxn.drawImage(canvas, 0,0,200, 200)
    var x = event.layerX;
    var y = event.layerY;
    ctxn.drawImage(canvas,
                      Math.abs(x - 5),
                      Math.abs(y - 5),
                      10, 10,
                      0, 0,
                      200, 200);
 
    console.log(pos);
})

// const stream = mousedown.pipe(
//     withLatestFrom(createInput(range), createInput(color), (_, lineWidth, strokeStyle) => ({lineWidth, strokeStyle})),
//     switchMap(options => {
//         return mousemove.pipe(
//             map(e => ({
//                 x: e.offsetX,
//                 y: e.offsetY,
//                 options
//             })),
//             pairwise(),
//             takeUntil(mouseup),
//             takeUntil(mouseout)
//         )
//     })
// )

// stream.subscribe(([from, to]) => {
//     const { lineWidth, strokeStyle } = from.options;
//     ctx.lineWidth = lineWidth;
//     ctx.strokeStyle = strokeStyle;
//     ctx.beginPath();
//     ctx.moveTo(from.x, from.y);
//     ctx.lineTo(to.x, to.y);
//     ctx.stroke();
// })
