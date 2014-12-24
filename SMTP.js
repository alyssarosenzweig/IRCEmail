// implements ONLY the SMTP server portion,
// along with a few helpers for, e.g.: getting mail, etc.

var net = require('net');

var host = "localhost";
var motd = "220 "+host+" ESMTP IRCMail\r\n";

var inbox = {};

net.createServer(function(conn) {
	conn.write(motd);

	var dataMode = false;
	var body = "";
	var from = "";
	var to = [];

	conn.on('data', function(data) {
		console.log(data.toString());

		if(dataMode) {
			var parts = data.toString().split("\r\n.\r\n");
			body += parts[0];

			if(parts.length > 1) {
				dataMode = false;
				conn.write("250 OK\r\n");

				var letter = {
					from: from,
					to: to,
					body: body
				};

				if(!inbox[to]) inbox[to] = [];
				inbox[to].push(letter);

				// prevent leaking for other messages
				body = "";
				from = "";
				to = [];
			}
		} else {
			data.toString().split("\r\n").map(function(line) {
				var commands = line.split(' ');

				if(commands[0] == "HELO") {
					conn.write("250 Hello "+commands[1]+", I am glad to meet you.\r\n");
				} else if(commands[0] == "EHLO") {
					conn.write("250 "+host+" isn't really extended!\r\n");
				} else if(commands[0] == "MAIL") {
					conn.write("250 Ok.\r\n");
					from = commands[1].slice(6, -1);
				} else if(commands[0] == "RCPT") {
					conn.write("250 Ok.\r\n");
					to.push(commands[1].slice(4, -1));
				} else if(commands[0] == "DATA") {
					conn.write("354 End data with CRLF.CRLF\r\n");
					dataMode = true;
				} else if(commands[0] == "QUIT") {
					conn.write("221 Bye\r\n");
				}
			})
		}
	});
}).listen(25);