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

var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",
   auth: {
       user: "nkaujhmono@gmail.com",
       pass: "hmonomusic01"
   }
});

function sendMail_(mail_r,user_r,p_r,socket_r)
{
	var x = Math.floor((Math.random() * 10000000) + 1);
	insert_r(user_r,x,p_r); 
	smtpTransport.sendMail({// sender address
	   to: "Your Name <"+mail_r+">", // comma separated list of receivers
	   subject: "Welcome to www.nkaujhmono.com", // Subject line
	   text: "Like ยืนยันการลงทะเบียน : http://www.nkaujhmono.com/ok?x="+x+"&user="+user_r // plaintext body
	}, function(error, response){
	   if(error){
		   console.log(error);
	   }else{
		   socket_r.emit('r_pass', { value: 'ok_ok' });
	   }
	});
}



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
  
  socket.on('my_start_time_out', function(){
	  my_f_time_out();
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
	
	socket.on('r_pass', function(data){
		socket.id_user = "0";
		console.log("ben");
		sendMail_(data.mail_r,data.user_r,data.p_r,socket);
	 });
	
	
  //setInterval(function(){time_out_user();},60000);
  
  //io.sockets.emit('hello', { value: "welcome" });
});
server.listen(3000, function(){
  console.log('listening on *:3000');
});

function clear_db_chat_all() 
{
	connection.query("SELECT COUNT( * )AS rows_count FROM chat_all WHERE (SELECT COUNT( * ) FROM chat_all) > '20'", function(error, count_rows) 
	{
		var rows_count = parseInt(count_rows[0].rows_count);
		//console.log("ok"+rows_count);
		if(error)
		{
			//console.log(error);
		}
		else
		{
			if(rows_count>20)
			{
				connection.query("DELETE FROM `chat_all` WHERE 1 limit "+(rows_count-20), function(error, count_rows) 
				{
					//console.log("ok");
				});
				
			}
			//console.log(rows[0].name_show);
			//socket.emit('receive_freinds_first', { value: count_rows });
			//console.log(rows.length);
		}
	});
	//SELECT COUNT( * ) -1 FROM user_nkauj_hmo_no
	//DELETE FROM table LIMIT 10(SELECT COUNT( * ) -1 FROM user_nkauj_hmo_no)
	/*
	SELECT *
FROM user_nkauj_hmo_no
WHERE (

SELECT COUNT( * ) -1
FROM user_nkauj_hmo_no
) = (
SELECT COUNT( * ) -1
FROM user_nkauj_hmo_no )
LIMIT 0 , 30
	*/
}
setInterval(function(){clear_db_chat_all();},86400000);
//clear_db_chat_all();
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
	var my_freinds_on = {};
	length_my_freinds_on = id_my_freinds.length;
	if(length_my_freinds_on==0)
	{
		return ;
	}
	for(i_imf=0;i_imf<length_my_freinds_on;i_imf++)
	{
		
		c_id_my_freinds = id_my_freinds[i_imf];
		//console.log("   "+on_alls["3"]+" "+c_id_my_freinds);
		if(on_alls[""+c_id_my_freinds]=="on")
		{
			my_freinds_on[""+c_id_my_freinds]="on";
		}
	}
	socket.emit('freinds_on', { value: my_freinds_on ,number_on_alls:on_alls.length});
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

function insert_r(user_r,x_r,password_r)
{
	connection.query("SELECT * FROM `user_nkauj_hmo_no` WHERE `username` = '"+id_get_freinds+"' `password` = '"+password_r+"'", function(error, rows) 
	{
		if(error)
		{
			//console.log(error);
		}
		else
		{
			//console.log(rows[0].name_show);
			if(rows.length==1)
			{
				var  q = "INSERT INTO  user_r"+
					"(`username`, `pass`,)"+
					"VALUES ";

					//console.log(chile);
					q += "('"+user_r+"','"+x_r+"'),";

				connection.query(q, function(error, rows) {
					if(error)
					{	
								//console.log(error);
					}
					else
					{
					}
				});
			}
		}
	});
		

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
