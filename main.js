var IRC = require("./IRC");
var SMTP = require("./SMTP");

var host = "localhost";

var smtpserver = new SMTP(host);

var ircserver = new IRC(":"+host, "EMAIL", function(connection, channel, message) {
	if(!connection.authed) connection.authed = [];

	if(connection.authed.indexOf(channel) > -1) {
		var account = smtpserver.inbox[channel];

		if(!account) {
			connection.write(":"+server.mask+" PRIVMSG "+channel+" :No such account\r\n");
		} else {
			connection.write(":"+server.mask+" PRIVMSG "+channel+" :You have "+account.length+" messages\r\n");
		}

	} else {
		if(message == "test") {
			connection.write(":"+server.mask+" PRIVMSG "+channel+" :Authenticating with password "+message+"\r\n");
			connection.authed.push(channel);
		} else {
			connection.write(":"+server.mask+" PRIVMSG "+channel+" :Uh oh! That's not right :/\r\n");
		}
	}
});

ircserver.listen();