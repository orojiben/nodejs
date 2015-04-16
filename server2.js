var http = require('http'), io = require('socket.io');

// Start the server at port 8866
var server = http.createServer(function(req, res){

        // Send HTML headers and message
        res.writeHead(200,{ 'Content-Type': 'text/html' });
        res.end('<h1>Hello Socket Lover!</h1>');
});
server.listen(8866,"128.199.155.14");

// Create a Socket.IO instance, passing it our server
var socket = io.listen(server);