var LocalStrategy  = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load the user model
var User = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport) {
    
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
    passport.use(new LocalStrategy(User.authenticate()));
    
    passport.use(new GoogleStrategy({
        
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        passReqToCallback: true
        
    }, function(req, accessToken, refreshToken, profile, done) {
        
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            if (!req.user) {
                // try to find the user based on their Google id
                User.findOne({'google.id': profile.id}, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        // if there is a user id already but no token (user was linked at one point and then removed)
                        // just add our token and profile information
                        if (!user.google.token) {
                            user.google.token = accessToken;
                            
                            user.save(function(err) {
                                if (err) {
                                    throw err;
                                }
                                return done(null, user);
                            });
                        }
                        
                        // if a user is found, log them in
                        return done(null, user);
                    } else {
                        // if the user isn't in our database, create a new user
                        console.log("making new google account!!!!!!!!!!!!!!!!!!!!!!!!!");
                        var newUser = new User({
                            username: (profile.emails[0].value).split("@")[0],
                            google: {
                                id: profile.id,
                                token: accessToken
                            },
                            info: {
                                name: {
                                    first: profile.name.givenName,
                                    last: profile.name.familyName
                                },
                                gender: profile.gender,
                                email: profile.emails[0].value,
                                photo: (profile.photos[0].value).split("?")[0],
                                // cover: profile._json.cover.coverPhoto,
                                social: {
                                    googleplus: profile.url
                                }
                            }
                        });
                        
                        // save the user
                        newUser.save(function(err) {
                            if (err) {
                                throw err;
                            }
                            return done(null, newUser);
                        });
                    }
                });
            } else {
                console.log("linking google account!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                // user already exists and is logged in, we have to link accounts
                var user = req.user;
                
                console.log(user);
                
                // update the current user's google credentials
                user.google.id = profile.id;
                user.google.token = accessToken;
                user.info.name = {
                    first: profile.name.givenName,
                    last: profile.name.familyName
                };
                user.info.gender = profile.gender;
                user.info.email = profile.emails[0].value;
                user.info.social.googleplus = profile.url;
                
                // save the user
                user.save(function(err) {
                   if (err) {
                       throw err;
                   }
                   return done(null, user);
                });
            }
        });
    }));
};