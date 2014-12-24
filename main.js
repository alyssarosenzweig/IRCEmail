var IRC = require("./IRC");

var server = new IRC(":localhost", function(connection, channel, message) {
	console.log(connection.nick);
	console.log(channel);
	console.log(message);
});

server.listen();