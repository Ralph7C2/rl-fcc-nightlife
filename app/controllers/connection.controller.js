var ConnectionInfo = require('../models/connection-info.js');

module.exports = function(req, res, next) {
	console.log("Connection from "+req.ip);
	ConnectionInfo.findOne({'ip' : req.ip}, function(err, connection) {
		if(err) {
			console.log(err);
		} else {
			if(connection) {
				console.log("connection found, setting req.lastSearch");
				req.lastSearch = connection.lastSearch;
			} else {
				var newConnection = new ConnectionInfo();
				newConnection.ip = req.ip;
				newConnection.save(function(err) {
					if(err) console.log(err);
					console.log("Saved connection info");
				});
			}
		}
		next();
	});
}