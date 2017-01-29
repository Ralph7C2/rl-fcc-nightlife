module.exports = function(app, passport) {
	app.get('/', function(req, res) {
		res.render('index.ejs', {
			user : req.user
		});
	});
	
	app.get('/login', function(req, res) {
		res.render('login.ejs', {message : req.flash('loginMessage')});
	});
	
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/',
		failureRedirect : '/login',
		failureFlash : true
	}));
	
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', {
			message : req.flash('signupMessage'),
			user : req.user
		});
	});
	
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/',
		failureRedirect : '/signup',
		failureFlash : true
	}));
	
	function isLoggedIn(req, res, next) {
		if(req.isAuthenticated())
			return next();
		res.redirect('/');
	}
}