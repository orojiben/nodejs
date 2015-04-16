server = require('http').Server();
var socketIO = require('socket.io');
var io = socketIO.listen(server);


var buffer_message = new Array();

io.sockets.on('connection', function(socket){
  console.log("connect");
  socket.on('send_messages', function(data){
      //console.log("hello : " + data.value);
	  //console.log(data.messages);
      io.sockets.emit('receive_messages_all', { name:data.name,messages:data.messages,
		img:data.img,color:data.color,color_bg:data.color_bg,time:data.time}); //SV ส่งให้ทุกคน
		buffer_message.push([data.idu,data.messages,data.color,data.color_bg,data.time_db]);
	  //socket.broadcast.emit('hello', { value: data.value }); //SV ส่งให้ทุกคนยกเว้นตัวเอง
	  //sockets.emit('hello', { value: data.value }); //SV ส่งไห้ตัวเองเท่านั้น
  });
  socket.on('disconnect', function(){
      console.log("disconnect");
  });
  get_messages_connect(socket);
  //io.sockets.emit('hello', { value: "welcome" });
});
server.listen(8080, function(){
  console.log('listening on *:8080');
});