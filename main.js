var IRC = require("./IRC");
var SMTP = require("./SMTP");

var host = "localhost";

var smtpserver = new SMTP(host);

var ircserver = new IRC(":"+host, "EMAIL", function(connection, channel, message) {
	if(!connection.authed) connection.authed = [];

	console.log(message);

	if(connection.authed.indexOf(channel) > -1) {
		var account = smtpserver.inbox[channel.slice(1)];

		if(!account) {
			connection.write(":"+ircserver.mask+" PRIVMSG "+channel+" :No such account\r\n");
		} else {
			if(message == "help") {
				connection.write(":"+ircserver.mask+" PRIVMSG "+channel+" :type count, get [msg id]\r\n");
			} else if(message == "count") {
				connection.write(":"+ircserver.mask+" PRIVMSG "+channel+" :You have "+account.length+" messages\r\n");
			} else if(message.split(" ")[0] == "get") {
				connection.write(":"+ircserver.mask+" PRIVMSG "+channel+" :"+JSON.stringify(account[message.split(" ")[1]]));
			}
		}

	} else {
		if(message == "test") {
			connection.write(":"+ircserver.mask+" PRIVMSG "+channel+" :Authenticating with password "+message+"\r\n");
			connection.authed.push(channel);
		} else {
			connection.write(":"+ircserver.mask+" PRIVMSG "+channel+" :Uh oh! That's not right :/\r\n");
		}
	}
});

ircserver.listen();