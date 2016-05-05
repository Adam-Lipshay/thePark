// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({
    username:       String,
    local: {
        password:   String
    },
    google: {
        id:         String,
        token:      String,
        name:       String
    },
    info: {
        name: {
            first:  String,
            last:   String,
        },
        email:      String,
        gender:     String,
        photo: {
            type:   String,
            default:"http://i.imgur.com/2eNq8SA.png"
        },
        cover:      String,
        social: {
            googleplus: String
        }
    }
});

userSchema.plugin(passportLocalMongoose);


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);