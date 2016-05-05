var express = require('express');
var passport = require('passport');
var path = require('path');
var localRoutes = express.Router(); // local user authentication
var googleRoutes = express.Router(); // google authentication
var connectRoutes = express.Router(); // connect local and google together
var unlinkRoutes = express.Router(); // disconnect linked accounts
var apiRoutes = express.Router(); // connect local and google together
var basicRoutes = express.Router(); // regular routes to pages

var User = require('./models/user');

module.exports = function(app, passport) {

	// local auth routes ===================================================================================
	
	// registration route
	localRoutes.post('/register', function(req, res, next) {
		User.register(new User({
			username: req.body.username,
			info: {
				name: req.body.name,
				email: req.body.email,
				gender: req.body.gender
			}
		}), req.body.password, function(err, account) {
			if (err) {
				return res.status(500).json({
					err: err
				});
			}
			passport.authenticate('register')(req, res, function () {
				return res.status(200).json({
					status: "Registration successful"
				});
			});
		});
	});
	
	// login route
	localRoutes.post('/signin', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.status(401).json({
					err: info
				});
			}
			req.logIn(user, function(err) {
				if (err) {
					return res.status(500).json({
						err: "Could not log in user"
					});
				}
				res.status(200).json({
					status: "Login successful"
				});
			});
		})(req, res, next);
	});
	
	// logout route
	localRoutes.get('/signout', function(req, res) {
		req.logout();
		res.status(200).json({
			status: "Logged out"
		});
	});
	
	// return t/f if user is logged in
	localRoutes.get('/status', function(req, res) {
		if (!req.isAuthenticated()) {
			return res.status(200).json({
				status: false
			});
		}
		res.status(200).json({
			status: true,
			user: req.user
		});
	});
	
	// google OAuth routes =================================================================================
	
	// send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    googleRoutes.get('/', passport.authenticate('google', {scope: ['profile', 'email']}));
    
    // the callback after google has authenticated with the user
    googleRoutes.get('/callback', passport.authenticate('google', {
    	successRedirect: '/profile',
    	failureRedirect: '/'
    }));
    
    // authorize account (connecting other social account) =================================================
    connectRoutes.get('/local', function(req, res) {
    	res.render('connect-local.ejs', {message: req.flash('loginMessage')}); //Replace this with angular route
    });
    connectRoutes.post('/local', passport.authenticate('local-signup', {
    	successRedirect: '/profile',
    	failureRedirect: '/connect/local',
    	failureFlash: true
    	///////////////////////////////////////////////////////////////////////////////////// ^^^ handle redirects with angular
    }));
    
    connectRoutes.get('/google', passport.authorize('google', {scope: ['profile', 'email']}));
    connectRoutes.get('/google/callback', passport.authorize('google', {
    	successRedirect: '/profile',
    	failureRedirect: '/'
    	///////////////////////////////////////////////////////////////////////////////////// ^^ handle redirects with angular
    }));
    
    // deauthorize account (disconnecting social account) ==================================================
    unlinkRoutes.get('/google', function(req, res) {
    	var user = req.user;
    	console.log(user);
    	user.google.token = undefined;
    	user.save(function(err) {
    		if (err) {
    			throw err;
    		}
    		res.redirect('/profile');
    	})
    });
    
	// api routes ==========================================================================================
	
	// get a user
	apiRoutes.get('/users/:user_id', function(req, res) {
		User.find({_id: req.params.user_id}, {hash: 0, salt: 0}, function(err, user) {
			if (err) {
				res.send(err);
			}
			if (req.isAuthenticated()) {
				res.json(user);
			} else {
				res.status(401).json({
					status: "Not logged in"
				});
			}
		});
	});
	
	// basic routes ========================================================================================
	
	// route to handle all angular requests
	basicRoutes.get('*', function(req, res) {
	    res.render('index.ejs');
	});
	
	// apply routes to app =================================================================================
	app.use('/auth/local', localRoutes);
	app.use('/auth/google', googleRoutes);
	app.use('/connect', connectRoutes);
	app.use('/unlink', unlinkRoutes);
	app.use('/api', apiRoutes);
	app.use('/', basicRoutes);
};