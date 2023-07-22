const BG_COLOR = '#231f20';
const SNAKE_COLOR = '#c2c2c2';
const FOOD_COLOR = '#e66916';

const gameScreen = document.querySelector('#gameScreen');
let canvas, ctx;

const gameState={
    player:{
        pos:{
            x:3,
            y:10
        },
        vel:{
            x:1,
            y:0
        },
        snake:[
            {x:1,y:10},
            {x:2,y:10},
            {x:3,y:10},
        ]
    },
    food:{
        x:7,
        y:7
    },
    gridsize:20

}

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

const paintGame = (state)=>{//state -> gameState
    ctx.fillStyle=BG_COLOR;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    const food = state.food;
    const gridsize = state.gridsize;
    const size = canvas.width/gridsize;

    ctx.fillStyle = FOOD_COLOR;
    //ith cell but we have to multiply cell length to get pixel
    ctx.fillRect(food.x*size,food.y*size,size,size);

    paintPlayer(state.player,size,SNAKE_COLOR);
}

const paintPlayer = (playState,size,color)=>{
    const snake=playState.snake;

    ctx.fillStyle = color;
    for(let cell of snake){
        ctx.fillRect(cell.x*size,cell.y*size,size,size);
    }

}

paintGame(gameState);