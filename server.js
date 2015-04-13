server = require('http').Server();
var socketIO = require('socket.io');
var io = socketIO.listen(server);
io.sockets.on('connection', function(socket){
  console.log("connect");
  socket.on('send_messages', function(data){
      //console.log("hello : " + data.value);
	  //console.log(data.messages);
      io.sockets.emit('receive_messages_all', { name:data.name,messages:data.messages,
		img:data.img,color:data.color,color_bg:data.color_bg,time:data.time}); //SV ส่งให้ทุกคน
	  //socket.broadcast.emit('hello', { value: data.value }); //SV ส่งให้ทุกคนยกเว้นตัวเอง
	  //sockets.emit('hello', { value: data.value }); //SV ส่งไห้ตัวเองเท่านั้น
  });
  socket.on('disconnect', function(){
      console.log("disconnect");
  });
  //io.sockets.emit('hello', { value: "welcome" });
});
server.listen(81, function(){
  console.log('listening on *:81');
});