const BG_COLOR = '#231f20';
const SNAKE_COLOR = '#c2c2c2';
const FOOD_COLOR = '#e66916';
const SNAKE_COLOR2 = '#d45092';

// // Making a client instance
const socket = io('https://multiplayer-snake-production.up.railway.app/');
socket.on('init',handleInit);
socket.on('gameState',handleGameState);
socket.on('gameOver',handleGameOver);
socket.on('gameCode',handleGameCode);
socket.on('unknownGame',handleUnknowGame);
socket.on('tooManyPlayers',handleTooManyPlayers);



const gameScreen = document.querySelector('#gameScreen');
let canvas, ctx;
let playerNumber;
let gameActive = false;

const initialScreen = document.querySelector('#initialScreen');
const newGameButton = document.querySelector('#newGameButton');
const joinGameButton = document.querySelector('#joinGameButton');
const gameCodeInput = document.querySelector('#gameCodeInput');
const gameCodeDisplay = document.querySelector('#gameCodeDisplay');

newGameButton.addEventListener('click',newGame);
joinGameButton.addEventListener('click',joinGame);

function newGame(){
    socket.emit('newGame');
    init(); 
}

function joinGame(){
    const code = gameCodeInput.value;
    socket.emit('joinGame',code);
    init();
}

const gameState = {
    players: [{
            pos: { x: 3, y: 10 },
            vel: { x: 1, y: 0 },
            snake: [
                { x: 1, y: 10 },
                { x: 2, y: 10 },
                { x: 3, y: 10 }, 
            ]
        },
        {
            pos: { x: 3, y: 1 },
            vel: { x: 1, y: 0 },
            snake: [
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 3, y: 1 }, 
            ]
        }],
    food: {},
    gridsize: 20,
};

const init = () => {
    initialScreen.style.display = 'none';
    gameScreen.style.display = 'block';

    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');

    canvas.width = canvas.height = 600;

    // Filling canvas with bg color
    ctx.fillStyle = BG_COLOR;
    // Setting x1, y1 and x2, y2
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    paintGame(gameState);

    document.addEventListener('keydown', (e) => {
        socket.emit('keydown',e.key);
    });
    gameActive = true;
};
 
const paintGame = (state) => { //state -> gameState

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const food = state.food;
    const gridsize = state.gridsize;
    const size = canvas.width / gridsize;

    ctx.fillStyle = FOOD_COLOR;
    // ith cell but we have to multiply cell length to get pixel
    ctx.fillRect(food.x * size, food.y * size, size, size);

    paintPlayer(state.players[0], size, SNAKE_COLOR);
    paintPlayer(state.players[1], size, SNAKE_COLOR2);
};

const paintPlayer = (playState, size, color) => {
    const snake = playState.snake;

    ctx.fillStyle = color;
    for (let cell of snake) {
        ctx.fillRect(cell.x * size, cell.y * size, size, size);
    }
};


function handleInit(number) {
    playerNumber = number; 
}

function handleGameState(gameState){
    if(!gameActive){
        return;
    }
    gameState = JSON.parse(gameState);//since gameState will be received as a string
    requestAnimationFrame(()=>paintGame(gameState));
}

function handleGameOver(data){
    if(!gameActive){
        return;
    }
    data = JSON.parse(data);
    if(data.winner === playerNumber){
        alert("You Win!");
    }else{
        alert("You lost!");
    }
    gameActive = false; 
}

function handleGameCode(gameCode){
    gameCodeDisplay.innerText = gameCode;
}

function handleUnknowGame(){
    reset();
    alert("Unknow Game Code!!!");
}
function handleTooManyPlayers(){
    reset();
    alert("This game is full!!!"); 
}

function reset(){
     playerNumber = null;
     gameCodeInput.value = ""; 
     gameCodeDisplay.innerText = "";
     initialScreen.style.display = "block";
     gameScreen.style.display = "none"; 
}