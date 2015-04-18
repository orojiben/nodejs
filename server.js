server = require('http').Server();
var socketIO = require('socket.io');
var io = socketIO.listen(server);

var mysql      = require('mysql');
var connection = mysql.createPool({
  host     : 'localhost',
  user     : 'admin_nkuajhmono',
  password : 'PW8lkmLlp5@&',
  database : 'admin_nkuajhmono'
});


var on_alls = {};// associativeArray["id"] = id
/*associativeArray["one"] = "First";
associativeArray["two"] = "Second";
associativeArray["three"] = "Third";*/

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
	  //socket.emit('hello', { value: data.value }); //SV ส่งไห้ตัวเองเท่านั้น
  });
  
  socket.on('my_freinds', function(data){
	socket.id_user = ""+data.id_user_input+"";
	on_alls[socket.id_user] = "on";
    get_freinds_connect(socket,data.id_user_input);
  });
  
  socket.on('freinds_on', function(data){
    get_freinds_on(socket,data.input_list_my_freinds);
  });
  
  socket.on('disconnect', function(){
	  id_user = socket.id_user;
	  delete on_alls[id_user];
      console.log("disconnect");
  });
  
  socket.on('my_stop_time_out', function(){
	  my_stop_time_out();
  });
  
  get_messages_connect(socket);
  
	function time_out_user()
	{
		socket.disconnect();
	}

	var my_time_out;

	function my_f_time_out() {
		my_time_out = setTimeout(
			function(){ 
			time_out_user();
			}, 60000);
	}

	function my_stop_time_out() {
		clearTimeout(my_time_out);
		my_f_time_out();
	}
	
	my_f_time_out();
	
  //setInterval(function(){time_out_user();},60000);
  
  //io.sockets.emit('hello', { value: "welcome" });
});
server.listen(3000, function(){
  console.log('listening on *:3000');
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

function get_freinds_connect(socket,id_get_freinds) 
{
	connection.query("SELECT * FROM `my_freinds_all` WHERE `id_user_me` = '"+id_get_freinds+"' ORDER BY name_show ASC", function(error, rows) 
	{
		if(error)
		{
			//console.log(error);
		}
		else
		{
			//console.log(rows[0].name_show);
			socket.emit('receive_freinds_first', { value: rows });
			//console.log(rows.length);
		}
	});
}


function get_freinds_on(socket,id_my_freinds) 
{
	var my_freinds_on = new Array();
	length_my_freinds_on = id_my_freinds.length;
	for(i_imf=0;i_imf<length_my_freinds_on;i_imf++)
	{
		console.log(rows[0].name_show+"   "+on_alls);
		c_id_my_freinds = id_my_freinds[i_imf];
		if(on_alls[""+c_id_my_freinds]=="on")
		{
			my_freinds_on.push(c_id_my_freinds);
		}
	}
	socket.emit('freinds_on', { value: my_freinds_on });
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
