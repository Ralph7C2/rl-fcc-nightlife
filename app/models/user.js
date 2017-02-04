var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var goingToSchema = mongoose.Schema({
	businessId : String
});

var userSchema = mongoose.Schema({
	local : {
		email : String,
		password : String
	},
	twitter : {
		twitterId : String
	},
	goingTo : [goingToSchema]
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);