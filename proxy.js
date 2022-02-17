var express = require('express');
var app = express();

app.get('/', function (request, response) {
  //show this file when the "/" is requested
  response.sendFile(__dirname + '/build/index.html');
});

app.listen(8080);
