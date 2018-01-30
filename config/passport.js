// P A S S P O R T . J S
// Passport.js works with passport to create a user authentication system.


const bcrypt = require('bcrypt-nodejs');
const db = require('../models');

module.exports = function (passport, user) {
    // GLOBALS
    var User = user;
    let LocalStrategy = require('passport-local').Strategy;

    // serializeUser
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserializeUser
    passport.deserializeUser(function(id, done) {
        // Find the user by their id.
        User.findOne({ where: { id: id}}).then(function(user) {
            if(user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        })
    })

    // Local sign-up.
    passport.use('local-signup', new LocalStrategy({
            // Names of the fields on the form
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            // Creates a hash of the password
            var generateHash = function (password) {
                return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            };

            // Checks the user doesn't exist by email
            User.findOne({
                where: {
                    email: email
                }
            }).then(function (user) {
                if (user) {
                    return done(null, false, {
                        message: "That email is already being used. "
                    });
                } else {
                    // Checks the user doesn't exist by display name
                    User.findOne({ where: { displayName: req.body.displayName }}).then(function(displayUser) {
                        if(displayUser) {
                            return done(null, false, {
                                message: "The display name is already being used."
                            });
                        }
                        // Assign user data to new object
                        var userPassword = generateHash(password);
                        var data = {
                            email: email,
                            password: userPassword,
                            firstName: req.body.firstname,
                            lastName: req.body.lastname,
                            displayName: req.body.displayName,
                            isActive: false,
                            rep: 0,
                            usePoints: 100,
                            upVotes: 0,
                            downVotes: 0,
                            timesVotedUp: 0,
                            timesVotedDown: 0,
                        };

                        User.create(data).then(function (newUser, created) {
                            if (!newUser) return done(null, false);
                            if (newUser) return done(null, newUser);

                        })
                    });
                }
            })
        }
    ));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'inputEmail',
            passwordField: 'inputPassword',
            passReqToCallback: true,
        },
        function(req, email, password, done) {
            var User = user;
            var isValidPassword = function(userpass, password) {
                return bcrypt.compareSync(password, userpass);
            }

            User.findOne({ where: {email: email}}).then(function(user) {
                if(!user) {
                    return done(null, false, { message: 'Email does not exist!' });
                }
                if(!isValidPassword(user.password, password)) {
                    return done(null, false, { message: 'Incorrect password'});
                }

                var userInfo = user.get();
                
                return done(null, userInfo);
            }).catch(function(err) {
                console.log("Error ", err);
                return done(null, false, { message: "There was an error in the sign in process"});
            })  
        }
    ))
}