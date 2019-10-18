import { fromEvent } from 'rxjs';
import { map, pairwise, switchMap, takeUntil, withLatestFrom, startWith } from 'rxjs/operators';

export const rgbToHex = (r, g, b) => {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}
export const createInput = node => {
    return fromEvent(node, 'input').pipe(
        map(e => e.target.value),
        startWith(node.value)
    )
};
export const customContext = element => {
    const ctx = element.getContext('2d');
    const rect = element.getBoundingClientRect();
    const scale = window.devicePixelRatio;
    element.width = rect.width * scale;
    element.height = rect.height * scale;
    ctx.scale(scale, scale);
    return ctx;
}

const canvas = document.querySelector('#canvas');
const range = document.querySelector('#range');
const color = document.querySelector('#color');
const mousemove = fromEvent(canvas, 'mousemove');
const mousedown = fromEvent(canvas, 'mousedown');
const mouseup = fromEvent(canvas, 'mouseup');
const mouseout = fromEvent(canvas, 'mouseout');

const ctx = customContext(canvas);
console.log(ctx)
const stream = mousedown.pipe(
    withLatestFrom(createInput(range), createInput(color), (_, lineWidth, strokeStyle) => ({lineWidth, strokeStyle})),
    switchMap(options => {
        return mousemove.pipe(
            map(e => ({
                x: e.offsetX,
                y: e.offsetY,
                options
            })),
            pairwise(),
            takeUntil(mouseup),
            takeUntil(mouseout)
        )
    })
)

stream.subscribe(([from, to]) => {
    const { lineWidth, strokeStyle } = from.options;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
})
