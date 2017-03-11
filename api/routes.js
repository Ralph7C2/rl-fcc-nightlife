const express = require('express');
var router = express.Router();
const yelp = require('yelp-fusion');
var ConnectionInfo = require('../app/models/connection-info.js');
var client;
var User = require('../app/models/user.js');
var Q = require('q');
yelp.accessToken(process.env.YELP_ID, process.env.YELP_SECRET).then((res) => {
	client = yelp.client(res.jsonBody.access_token);
}).catch( (e) => {
	console.log(e);
});


	

router.post('/search', function(req, res) {
	if(client) {
		console.log("Client should be good!");
	}
	console.log(req.body.searchData);
	ConnectionInfo.findOneAndUpdate({'ip' : req.ip}, {$set : { 'lastSearch' : req.body.searchData }}, function(err, conn) {
		if(err) console.log(err);
		if(conn) {
			console.log(conn);
		}
	});
	if(client) {
		console.log("Client found");
		client.search({term : 'bar', location : req.body.searchData, limit : '50'}).then( (data) => {
			var body = JSON.parse(data.body);
			var responseJSON = [];
			promises = [];
			
			body.businesses.forEach( (business) => {
				promises.push(getGoingTos(business));
			});

			var allPromise = Q.all(promises);
			allPromise.done(function(result) {
				console.log(result);
				result.forEach(function(item) {
					responseJSON.push(item);
				});
				console.log(responseJSON);
				res.json(responseJSON);
			});
		}).catch((err) => {
			console.log(err);
			res.json({'err': err})
		});
	} else {
		res.json({'err' : 'client is not ready'});
	}
});

function getGoingTos(business) {
	var deferred = Q.defer();
	User.find({'goingTo' : business.id}, function(err, users) {
		var number_of_user = 0;
		if(users) {
			users = users.length
		}
		deferred.resolve({id : business.id, name : business.name, img_url: business.image_url, rating: business.rating, userCount : number_of_user});
	});
	return deferred.promise;
};

router.post('/goto', function(req, res) {
	toggleGoto(req.body.userId, req.body.locId).then(function(response) {
		response.id = req.body.locId;
		res.json(response);
	}).fail(function(response) {
		if(response.insert) {
			console.log("Didn't find user at that location! Adding!");
			User.update({_id: response.userId}, { $push : { 'goingTo' : {'businessId' : response.businessId }}}, { upsert : true}, function(err, mongoRes) {
					console.log(err);
					if(err) {
						console.log("update Error, sending error")
						
						res.json({'fail' : err});
					} else if(mongoRes) {
						console.log("updated, sending added");
						responseObj = {};
						responseObj.id = response.businessId;
						
						responseObj.action = 'added';
						responseObj.response = mongoRes;
						res.json(responseObj);
					} else {
						console.log("Didn't update user!?");
						res.json({'fail' : "didn't update user"});
					}
			});

		} else {
		res.json({'fail' : 'fail', 'err': response});
		}
	});
});

function toggleGoto(userId, businessId) {
	var deferred = Q.defer();
	User.findOne({'_id' : userId, 'goingTo.businessId' : businessId}, function(err, user) {
		if(err) deferred.reject(err);
		if(user) {
			console.log("Found user going to location!  Removing!")
			for(var i = 0;i<user.goingTo.length;i++) {
				if(user.goingTo[i].businessId === businessId) {
					user.goingTo.remove(user.goingTo[i]._id.toString());
					console.log("Removed");
					break;
				}
			}
			user.save(function(err) {
				console.log("saving");
				if(err) deferred.reject(err);
				else {
					console.log("Saved, sending action removed!");
					deferred.resolve({action: 'removed'});
				}
			});
		} else {
			deferred.reject({'insert' : true, 'userId' : userId, 'businessId' : businessId});
		}
		
	});
	return deferred.promise;
}

module.exports = router;