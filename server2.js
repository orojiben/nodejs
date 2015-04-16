var express = require('express');
var app = express();
var socketIO = require('socket.io');
var io = socketIO.listen(app);
// New call to compress content
app.use(express.compress());

app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000);
