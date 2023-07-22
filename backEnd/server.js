const express = require("express");
const app = express();
const http = require("http").createServer(app);
const {createGameState,gameLoop,getUpdatedVelocity} = require('./game');
const {FRAME_RATE} = require('./constants');

const io = require('socket.io')(http, {
  cors: {
    origin: "http://127.0.0.1:8080",
    methods: ["GET", "POST"]
  }
});

io.on('connection',(client)=>{
    const state = createGameState();
    //listening to client key press
    client.on('keydown',handleKeydown);

    function handleKeydown(key){
        const vel = getUpdatedVelocity(key,state);

        if(vel){
            state.player.vel=vel;
        }
    }
    startGameInterval(client,state);

})

function startGameInterval(client,state){
    const intervalID = setInterval(()=>{
        const winner = gameLoop(state);

        if(!winner){
            client.emit('gameState',JSON.stringify(state));
        }else{
            client.emit('gameOver');
            clearInterval(intervalID);
        }
    },2000/FRAME_RATE)
}

const port = process.env.PORT || 3000;
try {
  http.listen(port, () => {
    console.log("listening on localhost:" + port);
  });
} catch (e) {
  console.error("Server failed to listen " + e);
}

