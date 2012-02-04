#!/usr/bin/env node
var spawn = require('child_process').spawn;
var http = require('http');
var director = require('director');
var broomstick = require('broomstick');
var broom = new broomstick();
var router = new director.http.Router();
var optimist = require('optimist');
var argv = optimist.usage('Pipe an SSH session to your browser\nUsage: $0 hostname options')
  .alias('p', 'port')
  .describe('p', 'Specify a port to run the webserver on')
  .default('p', 8080)
  .argv;

if (!argv._[0]) {
  optimist.showHelp();
  process.exit();
}

router.get('/', broom);
router.get('*', broom);

var server = http.createServer(function (req, res) {
  router.dispatch(req, res);
});

server.listen(argv.p);

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
