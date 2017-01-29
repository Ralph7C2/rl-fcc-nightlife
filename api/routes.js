var express = require('express');
var router = express.Router();
var Yelp = require('yelp');

var yelp = new Yelp({
	consumer_key : process.env.YELP_ID,
	consumer_secret : process.env.YELP_SECRET
});

router.post('/search', function(req, res) {
	yelp.search({term : 'bar', location : 'odessa' })
	.then(function(data) {
		res.json({'data' : data});
	})
	.catch(function(err) {
		res.json({'error' : err});
	});
});

module.exports = router;