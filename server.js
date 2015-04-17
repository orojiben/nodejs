server = require('http').Server();
var socketIO = require('socket.io');
var io = socketIO.listen(server);

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'admin_nkuajhmono',
  password : 'PW8lkmLlp5@&',
  database : 'admin_nkuajhmono'
});

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
server.listen(8866, function(){
  console.log('listening on *:8866');
});

var myVar;/*
var  q = "INSERT INTO  chat_all"+
			"(`id_ca`, `time`, `id_nhn`, `messages`, `color`, `color_bg`)"+
			"VALUES ";

			//console.log(chile);
			q += "(' ','1234','1','124','124','214124')";
		
		
		connection.query(q, function(error, rows) {
			if(error)
			{	
						console.log(error);
			}
			else
			{
				console.log('ok');
			}
		});*/
function get_messages_connect(socket) 
{
	connection.query("SELECT * FROM `messages_all` WHERE 1 ORDER BY id_ca DESC LIMIT 20", function(error, rows) 
	{
		if(error)
		{
			//console.log(error);
		}
		else
		{
			//console.log(rows[0].name_show);
			socket.emit('receive_messages_first', { value: rows });
			//console.log(rows.length);
		}
	});
}
//get_messages_connect() ;
function my_timer_insert_db() 
{
	
	var get_before_messages = buffer_message;
	//console.log(get_before_messages.length);
	var length_message = get_before_messages.length;
	if(length_message>0)
	{
		var  q = "INSERT INTO  chat_all"+
			"(`id_ca`, `time`, `id_nhn`, `messages`, `color`, `color_bg`)"+
			"VALUES ";
		for(i=0;i<length_message;i++)
		{
			chile = get_before_messages[i];
			//console.log(chile);
			q += "(' ',"+"'"+chile[4]+"','"+chile[0]+"','"+chile[1]+"','"+chile[2]+"','"+chile[3]+"'),";
		}
		q = q.substring(0,q.length-1);
		/*var  q = "INSERT INTO  user_sib_tham"+
			"(`id_ust`, `username`, `password`, `sex`, `name_show`, `lastname_hmong`)"+
			"VALUES (' ','oro','1234','1','ben','val'),"+
			"(' ','oro1','1234','1','ben','val')";*/
		//console.log(q);
		connection.query(q, function(error, rows) {
			if(error)
			{	
						//console.log(error);
			}
			else
			{
				//console.log('ok');
				remove_array(0,length_message);
			}
		});
	}
	myVar = setTimeout(function(){ my_timer_insert_db() }, 1000);
}

myVar = setTimeout(function(){ my_timer_insert_db() }, 1000);

function remove_array(start,end)
{
	buffer_message.splice(start, end);
}
	/*"INSERT INTO  user_sib_tham"+
		"(`id_ust`, `username`, `password`, `sex`, `name_show`, `lastname_hmong`)"+
		"VALUES (' ','oro','1234','1','ben','val')"+
		"VALUES (' ','oro1','1234','1','ben','val')";
/*
var post  = {id: 1, title: 'Hello MySQL'};
var query = connection.query('INSERT INTO posts SET ?', post, function(err, result) {
  // Neat!
});
console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'*/
