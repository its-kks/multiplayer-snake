const express = require("express");
const app = express();
const http = require("http").createServer(app);
// const io = require('socket.io')(http);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://127.0.0.1:8080",
    methods: ["GET", "POST"]
  }
});

io.on('connection',(client)=>{
    client.emit('init',{data:'Hello world'})
})


const port = process.env.PORT || 3000;
try {
  http.listen(port, () => {
    console.log("listening on localhost:" + port);
  });
} catch (e) {
  console.error("Server failed to listen " + e);
}