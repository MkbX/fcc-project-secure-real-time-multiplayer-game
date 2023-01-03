require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();

app.use(function(req, res, next) {
  res.setHeader("X-powered-by","PHP 7.4.3");
  next();
});
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.noCache());

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

const io = socket(server);
players = [];

io.on('connection', (socket)=> {

  console.log(socket.id, 'connected');  
  players.push({id: socket.id, score: 0});
  console.log('After co', players);
  socket.broadcast.emit('newOpponent', socket.id);
  io.emit('allPlayers', players);

  socket.on('disconnect', ()=> {
    console.log(socket.id, ' disconnected');
    let  indexSocketDisconnected = players.map(e=>e.id).indexOf(socket.id);
    players.splice(indexSocketDisconnected, 1);
    console.log('After deco', players);
    socket.broadcast.emit('opponentLeft', socket.id);    
    
  });

  socket.on('collided', data =>{
    let  indexSocketDisconnected = players.map(e=>e.id).indexOf(data.id);    
    players[indexSocketDisconnected].score = data.score;
    io.emit('allPlayers', players);
    //console.log(data.id, players[indexSocketDisconnected].score);
  });

  
});

module.exports = app; // For testing
