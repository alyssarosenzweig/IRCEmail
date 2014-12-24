var IRC = require("./IRC");

var server = new IRC(":localhost", "EMAIL", function(connection, channel, message) {
	if(!connection.authed) connection.authed = [];

	if(connection.authed.indexOf(channel) > -1) {
		connection.write(":"+server.mask+" PRIVMSG "+channel+" :Unfortunately, email isn't actually implemented yet...\r\n");
	} else {
		if(message == "test") {
			connection.write(":"+server.mask+" PRIVMSG "+channel+" :Authenticating with password "+message+"\r\n");
			connection.authed.push(channel);
		} else {
			connection.write(":"+server.mask+" PRIVMSG "+channel+" :Uh oh! That's not right :/\r\n");
		}
	}
});

server.listen();