#broomstick

Lightweight streaming and in-memory caching static file middleware for Director

![broomstick](http://i.imgur.com/B2UpG.jpg)

##install

    npm install broomstick

##usage

If you would like to have a `./public` folder with an index.html and some images in it, the following will suffice:

````javascript
var http = require('http'),
    director = require('director'),
    broomstick = require('broomstick');

var broom = new broomstick();
var router = new director.http.Router();

router.get('*', broom);

var server = http.createServer(function (req, res) {
  router.dispatch(req, res);
});

server.listen(8080);
````

##configuration

When creating a `new broomstick()` object, you can specify options. These are the defaults:

````javascript
var broom = new broomstick({
  path: 'public',
  verbose: false,
  index: 'index.html' // default file to load on ./ paths
});
````

##test

    $ node examples/test.js

...and in a separate terminal:

    $ curl http://localhost:8080/hello.txt
    Hello world!

##license

(The MIT License)

Copyright (c) 2011 Cam Pedersen <cam@onswipe.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

