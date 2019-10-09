const userForm = document.getElementById('user_form')
const waitingForm = document.getElementById('waitingForm')
const scoreinput = document.getElementById('score')
const userURL = `https://cryptic-crag-84668.herokuapp.com/users`

//window.gameRoomUrl = "http://localhost:3000"
//window.waitingRoomUrl = "http://localhost:3000"


var socket
var player = {}
var playerList = []

userForm.addEventListener('submit', goToWaitingRoom)
waitingForm.addEventListener('submit', cancelWaitingRoom )

document.addEventListener( 'DOMContentLoaded', function( event ) {
  console.log('Hola!')
});

function fetchData() {
  fetch(userURL)
    .then(res => res.json())
    .then((data) => {
      data.sort(function(a, b) {return b.score - a.score})
      let topTen = data.slice(0, 10)
      topTen.forEach(user => {
        let userscores = `<h3>${user.username} - ${user.score}</h3>`
        document.getElementById('topusers').innerHTML += userscores
      })
    })
}


function addUser(username, score) {
  fetch(userURL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'username': username,
      'score': score
    })
  })
    .then(res => res.json())
    .then(data => localStorage.setItem('user_id', data.id))
}

function createUser(ev) {
  ev.preventDefault()
  document.getElementById('form').style.display = "none"
  document.getElementById('users').style.display = ""
  let username = ev.target[0].value
  addUser(username, 0)
  fetchData()
  let game = new Phaser.Game(config)
}


function goToWaitingRoom(ev){
  ev.preventDefault()
  document.getElementById('waitingRoom').style.display = "block"
  document.getElementById('form').style.display = "none"

  socket = io.connect(window.waitingRoomUrl)
  
  socket.on("connect", (socket) => {
    console.log("SocketIO connected");
  });
 
  socket.on("room assigned", HandleRoomAssignationSocketIOEvent);
  socket.on("news", HandleNewsSocketIOEvent);
  socket.on("players in room", HandlePlayersInRoomSocketIOEvent);


  window.player = {};
  window.player.nickname = ev.target[0].value
  window.player.playerId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  window.player.token = "token-" + window.player.playerId;
  window.player.sprite = "superNormalSprite";

  socket.emit("join", window.player, (data) => {
    console.log("JOIN EVENT RESULT: "+ data);
    var result = JSON.parse(data);
    player.playerId = result.playerId;
  });
}


function HandlePlayersInRoomSocketIOEvent(e){
  console.log("[SocketIO] EVENT received: " + e);
  let data = e;
  document.getElementById('player-list').innerHTML = '';
  window.playerList = [];
  console.log("Data: "+ JSON.stringify(data));
  console.log("Size of incoming data: "+ data.length);
  data.forEach((user, index, object) => {
    var plyrs = user;
    console.log("Reviewing :"+  plyrs);
    window.playerList.push(plyrs)
    let playerNames = `<li>${plyrs.nickname}</li>`
    if (plyrs.nickname === window.player.nickname){
      playerNames = `<li>${plyrs.nickname} (me) </li>`
      console.log("splicing: "+window.player.nickname)
      // var asd = object.splice(index, 1); //We remove the current user from the list once listed in he room
      // console.log("kkkkkkkkkkkkkkkkkkkk :"+asd.nickname)
    }
    document.getElementById('player-list').innerHTML += playerNames
  })
  console.log(window.playerList.length);
}

function HandleRoomAssignationSocketIOEvent(e){
  console.log("Room Assigned")
  let data = e
  if (typeof e != 'object') {
    data = JSON.parse(e);
  }
  window.player.roomId = data.roomId
  window.playerList = data.playerList;
  socket.disconnect();
  window.game = new Phaser.Game(config)
}

function HandleNewsSocketIOEvent(e){
  console.log(JSON.stringify(e));
 
}


function cancelWaitingRoom(){
  document.getElementById('waitingRoom').style.display = "none"
  document.getElementById('form').style.display = "block"
}

 
document.getElementById('asd').addEventListener('click', startGameScene)
function startGameScene(){
  console.log("startGameScene!")
  document.getElementById('waitingRoom').style.display = "none"
  document.getElementById('form').style.display = "none"
  let game = new Phaser.Game(config)
}

import GameScene from './game.js'
import TitleScene from './title.js'

let config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  parent: 'canvas',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 1000
      },
      debug: false
    }
  },
  scene: [
    TitleScene,
    GameScene
  ]
}
