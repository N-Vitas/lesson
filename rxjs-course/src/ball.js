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
    makeBalls(5);
    animFrame();
};
const get_random_color = () => {
    const letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    };
    return color;
};

// Получить случайное целое число в промежутке (min, max)
const rand = (min, max) => {
    return (Math.floor(Math.random()*(max-min+1))+min);
};
// Создание мячей
const makeBalls = (pointsNum = 50) => {
    for (var i=0; i < pointsNum; i++) {
        const s = rand(5,15);
        setupBall(get_random_color(), new Vector(rand(s, visual.width), rand(s,visual.height)), s, 3);
    };
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
cliclear.subscribe(() => {
    cancelAnimationFrame(animId);
    balls.length = 0;
});
const move = () => {
    context.clearRect(0, 0, visual.width, visual.height);
// проверяем точки на соударение:
// for (var i = points.length; --i >= 1 ;) {
//     for (var j=i-1; j >= 0; j--) {
//         var p1 = points[i];
//         var p2 = points[j];
//         var c1 = p1.coords;
//         var c2 = p2.coords;
//         var xx = c2.x-c1.x;
//         var yy = c2.y-c1.y;
//         var d = Math.sqrt(xx*xx + yy*yy);
//         if (d <= p1.radius || d <= p2.radius) {
//             var vector1 = p1.vector_multiplication(p1.mass / (p1.mass + p2.mass), p1.vector);
//             var vector2 = p1.vector_multiplication(p2.mass / (p1.mass + p2.mass), p2.vector);
//             p2.vector =  p2.vectors_sum(vector1, vector2);
//             if (p1.mass > p2.mass) p2.coords = p1.coords;
//             p2.mass = p1.mass + p2.mass;
//             p2.radius = Math.round(Math.sqrt(Math.pow(p1.radius,2)+Math.pow(p2.radius,2)));
//             points = points.slice(0, i).concat(points.slice(i + 1));
//             for (var k=0; k < points.length; k++) points[k].points = points;
//             break;
//         };
//     };

    for (let i = balls.length; --i >= 1 ;) {
        const ball = balls[i];
        console.log(ball)
        for (let j=i-1; j >= 0; j--) {
            const velo = balls[j];
    // balls.forEach((ball, i) => {
    //     balls.forEach((velo, j) => {
    //         if(i != j) {
                if(ball.isCollision(velo)) {
                    var vector1 = Vector.multiply(ball.pos2D, ball.mass / (ball.mass + velo.mass));
                    var vector2 = Vector.multiply(velo.pos2D, velo.mass / (ball.mass + velo.mass));
                    velo.pos2D.set(Vector.add(vector1, vector2));
                    if (ball.mass > velo.mass) velo.pos2D.set(ball.pos2D);
                    velo.mass = ball.mass + velo.mass;
                    velo.radius = Math.round(Math.sqrt(Math.pow(ball.radius,2)+Math.pow(velo.radius,2)));
                    const tmp = balls.slice(0, i).concat(balls.slice(i + 1));
                    for (var k=0; k < tmp.length; k++) balls[k] = tmp;
                    console.log('ball',tmp);
                }
            // }
        }
        ball.move().drawBall();
    }
};

click.subscribe(()=>init())