module.exports = function(req, res, next) {
	console.log("Connection from "+req.ip);
	next();
}