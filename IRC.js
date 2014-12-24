// implements the IRC server portion of IRCEmail
// bots and other related features are seperate modules

var net = require('net');

function IRCServer() {
	this.socket = net.createServer(this.onConnection);
}

IRCServer.prototype.listen = function(port) {
	this.socket.listen(port || 6667);
}

IRCServer.prototype.onConnection = function(connection) {
	console.log("New connection!");

	var that = this;

	connection.on('data', function(data) {
		that.onData(connection, data);
	});

	connection.on('end', function() {
		that.onEnd(connection);
	});
}

IRCServer.prototype.onData = function(connection, data) {
	console.log(data);
}

IRCServer.prototype.onEnd = function(connection) {
	console.log("Bye!");
}

module.exports = IRCServer;