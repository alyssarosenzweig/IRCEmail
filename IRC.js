// implements the IRC server portion of IRCEmail
// bots and other related features are seperate modules

var net = require('net');

function IRCServer(host, nick, messageHandler) {
	var that = this;

	this.host = host;
	this.mask = nick+"!~"+nick+"@unaffiliated/"+nick;

	this.onMessage = messageHandler;

	this.socket = net.createServer(function(connection) {
		that.onConnection(connection);
	});
}

IRCServer.prototype.listen = function(port) {
	this.socket.listen(port || 6667);
}

IRCServer.prototype.onConnection = function(connection) {
	console.log("New connection!");
	connection.mask = ":mysterious";

	var that = this;

	connection.on('data', function(data) {
		that.onData(connection, data);
	});

	connection.on('end', function() {
		that.onEnd(connection);
	});
}

IRCServer.prototype.onData = function(connection, data) {
	var that = this;

	data.toString().split("\r\n").map(function(line) {
		var commands = line.split(" ");
		var cmd = commands[0];

		console.log(commands);

		if(cmd == "USER") {
			connection.write(that.host+" 001 "+connection.nick+" :Welcome to IRCEmail. Join #"+commands[1]+" for your email!\r\n");
			connection.write(that.host+" 002 "+connection.nick+" :Your host is "+that.host+" on IRCEmail\r\n");
			connection.write(that.host+" 003 "+connection.nick+" :This server is as old as the epoch.. not really\r\n");
			connection.write(that.host+" 004 "+connection.nick+" "+(that.host.slice(1))+" "+"IRCEmail0.1"+" "+"i o\r\n");

			connection.write(that.host+" MODE "+connection.nick+" :+i\r\n");
		} else if(cmd == "NICK") {
			connection.nick = commands[1];
			connection.mask = connection.nick+"!~"+connection.nick+"@unaffiliated/"+connection.nick;
		} else if(cmd == "JOIN") {
			connection.write(":"+connection.mask+" JOIN "+commands[1]+"\r\n");
			connection.write(that.host+" 332 "+connection.nick+" "+commands[1]+" :Authenticate yourself\r\n");
			connection.write(that.host+" 333 "+connection.nick+" "+commands[1]+" email 0\r\n");
			connection.write(that.host+" 353 "+connection.nick+" = "+commands[1]+" :"+connection.nick+"\r\n");
			connection.write(that.host+" 366 "+connection.nick+" "+commands[1]+" :End of /NAMES list."+"\r\n");
		} else if(cmd == "PRIVMSG") {
			that.onMessage(connection, commands[1], commands[2].slice(2).join(" ").slice(1));
		}
	});
}

IRCServer.prototype.onEnd = function(connection) {
	console.log("Bye!");
}

module.exports = IRCServer;