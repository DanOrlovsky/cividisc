const userHelper = require('../helpers/userHelper');
const db = require('../models');
const moment = require('moment');
const path = require('path');
const busboy = require('busboy');
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
var myBucket = "civi-disc";

//AWS.config.loadFromPath('config.json');

var s3 = new AWS.S3({ params: { Bucket: myBucket }});


function RenderDashboard(req, res, msg) {
    db.Post.findAll({
        where: {
            userId: req.user.id
        },
        include: ["PostUser", "Topic"]
    }).then((posts) => {
        for (var i = 0; i < posts.length; i++) {
            posts[i].isClosed = (moment().unix() < posts[i].postDate + posts[i].postLife);
        }
        res.render('accounts/dashboard', {
            posts: posts,
            message: msg
        });
    })
}

module.exports = function (app, passport) {

    app.get('/signup', function (req, res) {
        res.render('accounts/signup');
    });
    app.get('/login', function (req, res) {
        res.render('accounts/login');
    });
    app.get('/dashboard', userHelper.isLoggedIn, function (req, res) {
        RenderDashboard(req, res, "");
    });
    app.get('/logout', function (req, res) {
        req.session.destroy(function (err) {
            res.redirect('/');
        });
    });
    app.get('/notifications', userHelper.isLoggedIn, (req, res) => {
        if (req.user) {
            db.Notification.findAll({
                where: {
                    userId: req.user.id,
                    isRead: false
                }
            }).then((data) => {
                return res.render('notifications', {
                    notifications: data
                });
            })
        }
    })
    app.post('/notification/read/:id', (req, res) => {
        let id = req.params.id;
        db.Notification.findOne({
            where: {
                id: id
            }
        }).then((notification) => {
            notification.update({
                isRead: true
            }).then(() => {
                return res.json({
                    completed: true
                });
            }).catch(err => {
                console.log(err);
                return res.json({
                    completed: false
                })
            })
        })
    })
    app.post('/signup', function (req, res, next) {
        var user = req.body;
        if (user.email === '' || user.password === '' || user.firstname === '' || user.lastname === '' || user.displayName === '')
            return res.render('accounts/signup', {
                message: "Please fill out the form completely"
            });

        passport.authenticate('local-signup', (err, user, info) => {
            if (err) return next(err)
            if (!user) {
                return res.render('accounts/signup', {
                    message: info.message
                });
            }
            req.logIn(user, function (err) {
                if (err) return next(err);
                return res.redirect('/');
            })
        })(req, res, next);
    });

    app.post('/login', function (req, res, next) {
        passport.authenticate('local-login', function (err, user, info) {
            if (err) {
                return next(err)
            };
            if (!user) {
                return res.render('accounts/login', {
                    message: info.message
                });
            }
            
            req.logIn(user, function (err) {
                if (err) return next(err);
                return res.redirect('/');
            })
        })(req, res, next);
    });

    app.post('/uploadImage', (req, res) => {
        var fileStream;
        req.pipe(req.busboy);
        req.busboy.on('file', (fieldname, file, filename) => {
            let allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
            let goodExtension = false;
            for (let i = 0; i < allowedExtensions.length; i++) {
                if (path.extname(filename).toLowerCase() === allowedExtensions[i]) goodExtension = true;
            }
            if (!goodExtension) return RenderDashboard(req, res, "Invalid file extension");
            filename = uuidv1() + filename;
            var params = {
                Key: "avatars/" + filename,
                Body: file,
            }
            s3.upload(params, function(err, data) {
                if(err) throw err;
                db.User.update({ imageUrl: data.Location }, {where: { id: req.user.id }}).then(() => {
                    res.redirect('/dashboard');
                });                
            });
        });
    });
}