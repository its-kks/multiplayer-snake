const {GRID_SIZE} = require('./constants')

module.exports = {
    initGame, 
    gameLoop,
    getUpdatedVelocity,
}

function initGame(){
    const state = createGameState();
    randomFood(state);
    return state; 
}

function createGameState(){
    return {
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
        gridsize: GRID_SIZE,
    };
    
}

function gameLoop(state){
    if(!state){
        return;
    }
    const playerOne = state.players[0];
    const playerTwo = state.players[1];
    playerOne.pos.x+=playerOne.vel.x;
    playerOne.pos.y+=playerOne.vel.y;

    playerTwo.pos.x+=playerTwo.vel.x;
    playerTwo.pos.y+=playerTwo.vel.y;
    //check boundary collision
    if(playerOne.pos.x<0 || playerOne.pos.x>GRID_SIZE ||
        playerOne.pos.y<0 || playerOne.pos.y>GRID_SIZE){
        return 2;
    }
    if(playerTwo.pos.x<0 || playerTwo.pos.x>GRID_SIZE ||
        playerTwo.pos.y<0 || playerTwo.pos.y>GRID_SIZE){
        return 1;
    }
    //food eating
    if(state.food.x===playerOne.pos.x && state.food.y===playerOne.pos.y){
        //add a new object to increase heigth
        //... -> spread Operator
        playerOne.snake.push({...playerOne.pos})
        playerOne.pos.x+=playerOne.vel.x;
        playerOne.pos.y+=playerOne.vel.y;
        //add new food
        randomFood(state);
    }
    if(state.food.x===playerTwo.pos.x && state.food.y===playerTwo.pos.y){
        //add a new object to increase heigth
        //... -> spread Operator
        playerTwo.snake.push({...playerTwo.pos})
        playerTwo.pos.x+=playerTwo.vel.x;
        playerTwo.pos.y+=playerTwo.vel.y;
        //add new food
        randomFood(state);
    }
    //updating moving each object of snake and checking for 
    //self collision
    if(playerOne.vel.x  || playerOne.vel.y){
        for(let cell of playerOne.snake){
            if(cell.x === playerOne.pos.x && cell.y === playerOne.pos.y){
                //collision has occured
                return 2;
            }
        }
        //still alive
        playerOne.snake.push({...playerOne.pos});
        playerOne.snake.shift();

    }
    if(playerTwo.vel.x  || playerTwo.vel.y){
        for(let cell of playerTwo.snake){
            if(cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y){
                //collision has occured

                return 1;
            }
        }
        //still alive
        playerTwo.snake.push({...playerTwo.pos});
        playerTwo.snake.shift();
    }
    return false;
}

function randomFood(state){
    const playerOne = state.players[0];
    const playerTwo = state.players[1];
    food={
        x: Math.floor(Math.random()*GRID_SIZE),
        y: Math.floor(Math.random()*GRID_SIZE),
    }
    
    //preventing food on top of snake
    for(let cell of playerOne.snake){
        if(cell.x==food.x && food.y==cell.y){
            randomFood(state);
        }
    }
    for(let cell of playerTwo.snake){
        if(cell.x==food.x && food.y==cell.y){
            randomFood(state);
        }
    }
    state.food=food;
}

function getUpdatedVelocity(key,vel){
    if(vel.x==1){
        switch(key){
            case 'ArrowUp':{
               return { x:0,y:-1}
            }
            case 'ArrowDown':{
                return { x:0,y:1}
            }
        }
    }
    else if(vel.x==-1){
        switch(key){
            case 'ArrowDown':{
               return { x:0,y:1}
            }
            case 'ArrowUp':{
                return { x:0,y:-1}
            }
        }
    }
    else if(vel.y==-1 || vel.y==1){
        switch(key){
            case 'ArrowLeft':{
               return { x:-1,y:0}
            }
            case 'ArrowRight':{
                return { x:1,y:0}
            }
        }
    }
    return vel;
}