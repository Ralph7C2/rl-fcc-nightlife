require('dotenv').load();
var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var flash = require('connect-flash');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var morgan = require('morgan');

var configDB = require('./config/database.js');
console.log(configDB.url);
console.log(process.env.MONGODB_URI);
mongoose.connect(configDB.url);
mongoose.Promise = global.Promise;
require('./config/passport')(passport);

var app = express();
var port = process.env.PORT || 8080;

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended : true}));

app.set('view engine', 'ejs');

app.use(session({secret : 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);

app.use('/api', require('./api/routes.js'));

app.listen(port);
console.log("Ready to rock on port "+port);