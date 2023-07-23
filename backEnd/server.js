const express = require("express");
const app = express();
const http = require("http").createServer(app);
const {initGame,gameLoop,getUpdatedVelocity} = require('./game');
const {FRAME_RATE} = require('./constants');
const { v4: uuidv4 } = require('uuid');

// Function to generate a custom-sized unique ID
function generateCustomUUID(size) {
  const id = uuidv4().replace(/-/g, '');
  return id.slice(0, size);
}

const state = {};
const clientRooms = {}; 

let io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


io.on('connection',(client)=>{

    //listening to client key press
    client.on('keydown',handleKeydown);
    client.on('newGame', handleNewGame );
    client.on('joinGame', handleJoinGame);

    function handleJoinGame(roomName) {
        let numClients = 0;
        const room = io.sockets.adapter.rooms.get(roomName);
        numClients = room.size;
    
        if (numClients === 0) {
          client.emit('unknownGame');
          return;
        } else if (numClients > 1) {
          client.emit('tooManyPlayers');
          return;
        }
    
        clientRooms[client.id] = roomName;
    
        client.join(roomName);
        client.number = 2;
        client.emit('init', 2);
        
        startGameInterval(roomName);
    }
    
    function handleNewGame(){
        let roomName = generateCustomUUID(5);
        
        clientRooms[client.id] = roomName; 
        client.emit('gameCode',roomName);  
        state[roomName] = initGame();        /*

        /*
        const propertyName = 'age';
        console.log(person[propertyName]); // Output: 30

        use of [] 
        */
        client.join(roomName);
        client.number = 1;
        client.emit('init',1);
    }

    function handleKeydown(key){
        const roomName = clientRooms[client.id];

        if(!roomName){
            return;
        }
        const vel = getUpdatedVelocity(key,state[roomName].players[client.number-1].vel);

        if(vel){
            state[roomName].players[client.number-1].vel = vel;
        }
    }

});

function startGameInterval(roomName){
    const intervalID = setInterval(()=>{
        const winner = gameLoop(state[roomName ]);

        if(!winner){
            emitGameState(roomName,state[roomName]); 
        }else{
            emitGameOver(roomName,winner);
            state[roomName] = null;
            clearInterval(intervalID);
        }
    },10000/FRAME_RATE)
}

function emitGameState(roomName,state){
    // printClientsInRoom(roomName);
    // function printClientsInRoom(roomName) {
    //     const room = io.sockets.adapter.rooms.get(roomName);
      
    //     if (!room) {
    //       console.log(`Room "${roomName}" does not exist.`);
    //       return;
    //     }
      
    //     console.log(`Clients in Room "${roomName}":`);
    //     for (const clientId of room) {
    //       const client = io.sockets.sockets.get(clientId);
    //       console.log(`- Client ID: ${client.id}`);
    //       // You can print more client information if needed, such as client's socket data, etc.
    //     }
    //   }
    io.to(roomName).emit('gameState', JSON.stringify(state));
}

function emitGameOver(roomName,winner){
    io.sockets.in(roomName).emit('gameOver',JSON.stringify({winner}));
}

const port = process.env.PORT || 3000;
try {
  http.listen(port, () => {
    console.log("listening on localhost:" + port);
  });
} catch (e) {
  console.error("Server failed to listen " + e);
}








//add to specefic room: socket.join(roomName);