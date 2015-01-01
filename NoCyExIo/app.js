
var express = require('express'),
	app 	= express(),
	server 	= require('http').createServer(app),
	Cylon = require('cylon'),
	io 		= require('socket.io').listen(server, { log: false });

	var oneDay = 86400000,
		verde = false,
		rojo = false,
		motor = false;


server.listen(3000);

app.engine('html', require('ejs').renderFile);

app.use( express.static('./public', { maxAge: oneDay }) );

app.get('/', function (req, res){	
	res.render('index.html');
});

var connection = function (socket){	

	socket.on('verdon', function (){
		verde = true;
	});
	socket.on('verdoff', function (){
		verde = false;
	});
	socket.on('rojon', function (){
		rojo = true;
	});
	socket.on('rojoff', function (){
                rojo = false;
        });
	socket.on('moton', function (){
                motor = true;
        });
        socket.on('motoff', function (){
                motor = false;
        });

};

Cylon.robot({
  connection: { name: 'raspi', adaptor: 'raspi' },
  device: { name: 'ledverde', driver: 'led', pin: 11 },

  work: function(my) {
    every((1).second(), function() {
    	if(verde){
    		my.ledverde.turnOn();
    	}else{
		my.ledverde.turnOff();
	}
    });
  }
}).start();

Cylon.robot({
  connection: { name: 'raspi', adaptor: 'raspi' },
  device: { name: 'ledrojo', driver: 'led', pin: 7 },

  work: function(my) {
    every((1).second(), function() {
        if(rojo){
                my.ledrojo.turnOn();
        }else{
                my.ledrojo.turnOff();
        }
    });
  }
}).start();

Cylon.robot({
  connection: { name: 'raspi', adaptor: 'raspi' },
  device: { name: 'motor', driver: 'led', pin: 15 },

  work: function(my) {
    every((1).second(), function() {
        if(motor){
                my.motor.turnOn();
        }else{
                my.motor.turnOff();
        }
    });
  }
}).start();


io.sockets.on('connection', connection);

module.exports = app;

console.log('Aplicacion Iniciada');
