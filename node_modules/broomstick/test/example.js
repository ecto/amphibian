var http = require('http'),
    director = require('director'),
    broomstick = require('../');

var broom = new broomstick({ path: '.' });
var router = new director.http.Router();

router.get('*', broom);

var server = http.createServer(function (req, res) {
  router.dispatch(req, res);
});

server.listen(8080);
