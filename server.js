// modules =================================================
var express         = require('express');
var mongoose        = require('mongoose');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var morgan          = require('morgan');
var passport        = require('passport');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var expressSession  = require('express-session');
var path            = require('path');
var flash           = require('connect-flash');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var sockets = require('./app/sockets')(io);
var port = process.env.PORT || 8080; // set our port
	
// config database
var db = require('./config/db');
mongoose.connect(db.url); // connect to our mongoDB database

require('./config/passport')(passport); // pass passport for configuration

// define middleware
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');

// required for passport
app.use(expressSession({ secret:'yNI#VJNNJBOPNgo*iDCLC0F^JQ78mgshq6HSMC476e#Y9hG2gwx!3V&%ob7euLbp8z4fWxNRvcr*4MKC$G43Hcdx3&YyQ^bks#qD@wBrQ&Iauc^09SNMpnDf4Cbd1OquZyFpNXBlYJ72r^f3Z*wCjDcF%zELE7y3vdWVJz0lk#5AMKa$imrI$DumbasFckp#SrB7sH&f9faZ0s2Ao*VzVpaEvS^xVaQwOavRB#w!p6!74fUkC@fsAKNVd3@5Q&8uyg34eQ8J@g5K'})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ==================================================
require('./app/routes')(app, passport); // pass our application and passport into our routes

// start app ===============================================
server.listen(port);	
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app