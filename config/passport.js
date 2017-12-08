const bcrypt = require('bcrypt-nodejs');
const db = require('../models');

module.exports = function (passport, user) {
    var User = user;
    let LocalStrategy = require('passport-local').Strategy;

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({ where: { id: id}}).then(function(user) {
            if(user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        })
    })
    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {

            var generateHash = function (password) {
                return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            };

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

                    var userPassword = generateHash(password);

                    var data = {
                        email: email,
                        password: userPassword,
                        firstName: req.body.firstname,
                        lastName: req.body.lastname,
                    };

                    User.create(data).then(function (newUser, created) {
                        if (!newUser) return done(null, false);
                        if (newUser) return done(null, newUser);

                    })
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