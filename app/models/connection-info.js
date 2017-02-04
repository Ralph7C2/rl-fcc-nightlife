var mongoose = require('mongoose');

var connectionSchema = new mongoose.Schema({
	ip : String,
	lastSearch : String
});

module.exports = mongoose.model('Connection', connectionSchema);