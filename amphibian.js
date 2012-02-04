#!/usr/bin/env node
var spawn = require('child_process').spawn;
var http = require('http');
var director = require('director');
var broomstick = require('broomstick');
var broom = new broomstick();
var router = new director.http.Router();
var argv = require('optimist')
  .usage('Usage: $0 -p [num]')
  .alias('p', 'port')
  .describe('p', 'Specify a port to run the webserver on')
  .default('p', 8080)
  .argv;

router.get('/', broom);
router.get('*', broom);

var server = http.createServer(function (req, res) {
  router.dispatch(req, res);
});

server.listen(argv.p || 8080);

var io = require('socket.io').listen(server);

// websockets were taking too long to fall back
io.set('transports', [
  'flashsocket',
  'htmlfile',
  'xhr-polling',
  'jsonp-polling',
]);

io.sockets.on('connection', function (socket) {
  var ssh = spawn('ssh', ['-vtt', argv._[0]]);

  // in
  socket.on('keypress', function (data) {
    console.log('piping to ssh' + data);
    ssh.stdin.write(data);
  });

  // out
  ssh.stdout.on('data', function (data) {
    console.log('piping stdout to browser' + data);
    socket.emit('stdout', data.toString());
  });

  ssh.stderr.on('data', function (data) {
    console.log('piping stderr to browser');
    socket.emit('stderr', data.toString());
  });
  
});
