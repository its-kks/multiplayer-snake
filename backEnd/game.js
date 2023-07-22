const {GRID_SIZE} = require('./constants')

module.exports = {
    createGameState,
    gameLoop,
    getUpdatedVelocity,
}

function createGameState(){
    return {
        player: {
            pos: { x: 3, y: 10 },
            vel: { x: 1, y: 0 },
            snake: [
                { x: 1, y: 10 },
                { x: 2, y: 10 },
                { x: 3, y: 10 },
            ]
        },
        food: {
            x: 7,
            y: 7
        },
        gridsize: GRID_SIZE,
    };
    
}

function gameLoop(state){
    if(!state){
        return;
    }

    const playerOne = state.player;
    playerOne.pos.x+=playerOne.vel.x;
    playerOne.pos.y+=playerOne.vel.y;

    //check boundary collision
    if(playerOne.pos.x<0 || playerOne.pos.x>GRID_SIZE ||
        playerOne.pos.y<0 || playerOne.pos.y>GRID_SIZE){
        return 2;
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
    return false;
}

function randomFood(state){
    const playerOne = state.player;
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
    state.food=food;
}

function getUpdatedVelocity(key,state){
    const vel = state.player.vel;
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
}