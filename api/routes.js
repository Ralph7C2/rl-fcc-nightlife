const express = require('express');
var router = express.Router();
const yelp = require('yelp-fusion');

var client;

yelp.accessToken(process.env.YELP_ID, process.env.YELP_SECRET).then((res) => {
	client = yelp.client(res.jsonBody.access_token);
}).catch( (e) => {
	console.log(e);
});


router.post('/search', function(req, res) {
	if(client) {
		client.search({term : 'bar', location : 'odessa', limit : '50'}).then( (data) => {
			var body = JSON.parse(data.body);
			var responseJSON = {businesses : []};
			body.businesses.forEach( (business) => {
				responseJSON.businesses.push({name : business.name, img_url: business.image_url, rating: business.rating});
			});
			res.json(responseJSON);
		}).catch((err) => {
			console.log(err);
			res.json({'err': err})
		});
	} else {
		res.json({'err' : 'client is not ready'});
	}
});

module.exports = router;