var Q = require('q');
var request = require('request');
var http = require('http');
service = {};

service.getLocationFromIP = function(IP) {
	var deferred = Q.defer();
	if(IP == '::1' || IP == '127.0.0.1') {
		IP = '199.21.127.1';
	}
	http.get('http://ip-api.com/json/'+IP, (res) => {
		if(res.statusCode === 200) {
			res.setEncoding('utf8');
			var rawData = '';
			res.on('data', (chunk) => { rawData+=chunk });
			res.on('end', () => {
				try {
					var parsedData = JSON.parse(rawData);
					if(parsedData.status === 'success') {
						deferred.resolve(parsedData);
					} else {
						deferred.reject(parsedData.message);
					}
				} catch(e) {
					console.log(e.message);
					deferred.reject(e.message);
				}
			});
		} else {
			deferred.reject({'failed' : 'failed'});
		}
	});
	return deferred.promise;
}


module.exports = service;