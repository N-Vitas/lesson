import { fromEvent } from 'rxjs';
import { Vector, Ball } from './vector';

const visual = document.querySelector('#visual');
visual.width = 500;
visual.height = 300;
const ball = document.querySelector('#ball');
const clear = document.querySelector('#clear');
const context = visual.getContext('2d');
const balls = new Array();
const click = fromEvent(ball, 'click');
const cliclear = fromEvent(clear, 'click');

let animId;

// инициализация
const init = () => {
    makeBalls();
    animFrame();
};
// Создание мячей
const makeBalls = () => {
    setupBall('#0000ff', new Vector(20, 170), 15, 15);
    setupBall('#ff0000', new Vector(150, 30), 21, 7);
    setupBall('#00ff00', new Vector(50, 30), 27, 4);
};

const setupBall = (color, pos, radius, speed) => {
    const ball = new Ball(radius, color, pos, new Vector(speed, speed), visual, context);
    ball.drawBall(context);
    balls.push(ball);
};

const animFrame = () => {
    animId = requestAnimationFrame(animFrame, visual);
    move();
};
cliclear.subscribe(() => cancelAnimationFrame(animId));
const move = () => {
    context.clearRect(0, 0, visual.width, visual.height);
    balls.forEach(ball => {
        ball.move().drawBall();
    })
};

click.subscribe(()=>init())