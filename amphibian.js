
var spawn = require('child_process').spawn;

var http = require('http'),
    director = require('director'),
    broomstick = require('broomstick');

var broom = new broomstick();
var router = new director.http.Router();

router.get('/', broom);
router.get('*', broom);

var server = http.createServer(function (req, res) {
  router.dispatch(req, res);
});

server.listen(8080);

var io = require('socket.io').listen(server);

io.set('transports', [
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);

io.sockets.on('connection', function (socket) {
  var ssh = spawn('ssh', ['-vtt', 'core']);

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
