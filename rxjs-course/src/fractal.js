import { fromEvent, timer } from 'rxjs';
import { customContext } from './canvas';

const visual = document.querySelector('#visual');
const fractal = document.querySelector('#fractal');
const context = customContext(visual);
const str = fromEvent(fractal, 'click');

const px = (x,y) => {
    const x1 = x + 275;
    const y1 = 275 - y;
    const pp = (y1*550 + x1)*4;
    return pp;
}

// - наша главная функция, которая и определяет как выглядит фрактал
const fract = (x,y,cx, cy, r) => {
    var r1, n, x1, y1;
    r1=x*x+y+y;
    n=0;
    x1=x;
    y1=y;
    while (r1<r) {
        x1 = x1*x1 - y1*y1 + cx;
        y1 = 2*x1*y1 + cy;
        r1 = x1*x1+y1*y1;
        n = n + 1;
        if (n>250) {return n;} 
    }
    return n;
}

str.subscribe(() => {
    const w = 550, h = 550,
          x = 0,  y = 0;
    const imgd = context.getImageData(0, 0, w, h);
    const pix = imgd.data;
    // рисуем точку в нормальных координатах
    const plotp = (x,y,r,g,b) => {
        pix[px(x,y)] = r;
        pix[px(x,y)+1] = g;
        pix[px(x,y)+2] = b;
        pix[px(x,y)+3] = 127;
    }
    const sx=800;
    const sy=-600;
    const m=1000;
    for (let x2=-250; x2<=250; x2++)
    {
      for (let y2=-250; y2<=250; y2++)
      {
            plotp(x2,y2,0, fract((x2+sx)/m,(y2+sy)/m, 0.38, 0.05, 500),0)
      }
    }
    context.putImageData(imgd, x, y);
});
