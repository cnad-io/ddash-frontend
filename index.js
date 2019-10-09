var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var players = [];
var MAX_ROOM_MEMEBER = 2;

app.get('/a', function(req, res){
    let result = 'have a good day!'
    switch (req.query.ops) {
        case "reset":
            console.log('reset option pressed')
            players = [];
            result = "Reset Executed!";
            break;
        case "room":
            var newQuota;
            if (!req.query.c){
              result = "Room Quota not changed, please append a c param";
            }else{
              result = "Room Quota changed from :"+MAX_ROOM_MEMEBER+" to: "+req.query.c ;
              MAX_ROOM_MEMEBER = req.query.c
            }
            players = [];
            break;
        default:
            break;
    }
  res.json(result);
});

io.on('connection', function(socket){
  console.log('a user connected '+ socket.id);
  socket.on('join', function(msg){
      players.push(msg);
      io.sockets.emit('player joined', JSON.stringify(players));
      if (players.length >= MAX_ROOM_MEMEBER){
        io.sockets.emit("room assigned", JSON.stringify(players));
      }
  });
  socket.on('player moved', msg =>{
    console.log("Player moved recieved: "+ msg);
    socket.broadcast.emit('remote player moved', msg);
  })
});
// socket.emit('message', "this is a test"); //sending to sender-client only
// socket.broadcast.emit('message', "this is a test"); //sending to all clients except sender
// socket.broadcast.to('game').emit('message', 'nice game'); //sending to all clients in 'game' room(channel) except sender
// socket.to('game').emit('message', 'enjoy the game'); //sending to sender client, only if they are in 'game' room(channel)
// socket.broadcast.to(socketid).emit('message', 'for your eyes only'); //sending to individual socketid
// io.emit('message', "this is a test"); //sending to all clients, include sender
// io.in('game').emit('message', 'cool game'); //sending to all clients in 'game' room(channel), include sender
// io.of('myNamespace').emit('message', 'gg'); //sending to all clients in namespace 'myNamespace', include sender
// socket.emit(); //send to all connected clients
// socket.broadcast.emit(); //send to all connected clients except the one that sent the message
// socket.on(); //event listener, can be called on client to execute on server
// io.sockets.socket(); //for emiting to specific clients
// io.sockets.emit(); //send to all connected clients (same as socket.emit)
// io.sockets.on() ; //initial connection from a client.



http.listen(3000, function(){
  console.log('listening on *:3000');
});