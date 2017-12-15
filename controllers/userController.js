const authHelper = require('../helpers/authHelper');
const db = require('../models');
const moment = require('moment');
module.exports = function(app, passport) { 
 
    app.get('/signup', function(req, res) {
        res.render('accounts/signup');
    });
    app.get('/login', function(req, res) { 
        res.render('accounts/login');
    });
    app.get('/dashboard', authHelper.isLoggedIn, function(req, res) {
        db.Post.findAll({ where: { userId: req.user.id }, include: [ "PostUser", "Topic" ]}).then((posts) => {
            for(var i = 0; i < posts.length; i++) {
                posts[i].isClosed = (moment().unix() < posts[i].postDate + posts[i].postLife);
            }
            res.render('accounts/dashboard', { posts: posts });
        })
    });
    app.get('/logout', function(req, res) {
        req.session.destroy(function(err) {
            res.redirect('/');
        });
    });
    app.get('/notifications', authHelper.isLoggedIn, (req, res) => {
        if(req.user) {
            db.Notification.findAll({ where: { userId: req.user.id, isRead: false }}).then((data) => {
                return res.render('notifications', { notifications: data});
            })
        }
    })
    app.post('/notification/read/:id', (req, res) => {
        let id = req.params.id;
        db.Notification.findOne({ where: { id: id}}).then((notification) => {
            notification.update({ isRead: true}).then(() => {
                return res.json({ completed: true });
            }).catch(err => {
                console.log(err);
                return res.json({ completed: false })
            })
        })
    })
    app.post('/signup', function(req, res, next) { 
        var user = req.body;
        if(user.email === '' || user.password==='' || user.firstname==='' || user.lastname==='') 
            return res.render('accounts/signup', { message: "Please fill out the form completely" });
        
        passport.authenticate('local-signup', (err, user, info) => {
            if(err) return next(err)
            if(!user) {
                console.log("=========================================")
                console.log(info.message);
                return res.render('accounts/signup', { message: info.message });
            }
            req.logIn(user, function(err) {
                if(err) return next(err);
                return res.redirect('/');
            })
        })(req, res, next);
    }); 

    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if(err) { console.log(err); return next(err) };
            if(!user) {
                console.log("=========================================")
                console.log(info.message);
                return res.render('accounts/login', { message: info.message });
            }
            console.log(user);
            req.logIn(user, function(err) { 
                if(err) return next(err);
                return res.redirect('/');
            })
        })(req, res, next); 
    });
}