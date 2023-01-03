import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');
const textArea = document.getElementById('log-window');
const player = new Player({x: 150, y: 150, score: 0, id: 'id'});
const collectible = new Collectible({x: randNum(20, 605), y: randNum(42, 470), points: 10, id: (socket.id+'_collectible')});
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

function randNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyUpHandler(e) {
    if(e.code == "ArrowUp" || e.key == "w") {
        upPressed = false;
    }    
    else if(e.code == "ArrowDown" || e.code == "KeyS") {
        downPressed = false;
    }
    else if(e.code == "ArrowLeft" || e.key == "a") {
        leftPressed = false;
    }
    else if(e.code == "ArrowRight" || e.code == "KeyD") {
        rightPressed = false;
    }
}

function keyDownHandler(e) {
    if(e.code == "ArrowUp" || e.key == "w") {
        upPressed = true;
    }    
     if(e.code == "ArrowDown" || e.code == "KeyS") {
        downPressed = true;
    }
     if(e.code == "ArrowLeft" || e.key == "a") {
        leftPressed = true;
    }
     if(e.code == "ArrowRight" || e.code == "KeyD") {
        rightPressed = true;
    }   
    
}


socket.on('connect', ()=>{
    textArea.value += ('You just logged.\n');
    player.id = socket.id;

    let result = '';

    function drawGame() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.font = 'bold 15px Courier New';
        context.fillStyle = 'white';
        context.fillText(`Move: ← ↑ → ↓ or WASD          Fire Race             ${result}`, 15, 17);
        context.font = 'bold 22px Courier New';
        context.strokeStyle = "white";
        context.rect(10, 32, 620, 440);
        context.stroke();
        context.fillText(player.figure, player.x, player.y);
        context.fillText(collectible.figure, collectible.x, collectible.y);
        player.movePlayer('', player.speed, upPressed, downPressed, leftPressed, rightPressed);
        if (player.collision(collectible)) {
            socket.emit("collided", {id: player.id, score: player.score});
        }        
        context.closePath();
        
    }

    

    socket.on('newOpponent', (data) => {
        textArea.value += (data + ' logged.\n');
    });

    socket.on('allPlayers', (data) => {
        result = player.calculateRank(data);
    });

    socket.on('opponentLeft', (data) => {
        textArea.value += (data + ' left.\n');
    });
    

    let interval = setInterval(drawGame, 1000 / 60);
});




