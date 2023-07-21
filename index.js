const BG_COLOR = '#231f20';
const SNAKE_COLOR = '#c2c2c2';
const FOOD_COLOR = '#e66916';

const gameScreen = document.querySelector('#gameScreen');
let canvas, ctx;

const init = () => {
    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');

    canvas.width = canvas.height = 600;

    // Filling canvas with bg color
    ctx.fillStyle = BG_COLOR;
    // Setting x1, y1 and x2, y2
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener('keydown', (e) => {
        console.log(e.key);
    });
}

init();
