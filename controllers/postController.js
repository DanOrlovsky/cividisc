const db = require('../models');
const authHelper = require('../helpers/authHelper');
const _ = require('underscore');
const moment = require("moment");


function getAllPosts(post) {
    return new Promise(function (resolve, reject) {
        db.Post.findAll({
            where: {
                parentId: post.id
            }
        }).then(function (children) {
            if (children) {
                var buildPromises = [];
                _.each(children, function (child) {
                    buildPromises.push(getAllPosts(child));
                });
                Promise.all(buildPromises).then(function (allPosts) {
                    post.children = [];
                    _.each(allPosts, function (expandedPost) {
                        post.children.push(expandedPost);
                    }, this);
                    resolve(post);
                });
            } else {
                resolve(post);
            }
        });
    });
};

module.exports = function (app, passport) {
    app.get('/posts/:id', (req, res) => {
        db.Post.findOne({
            where: {
                id: req.params.id
            }
        }).then((post) => {
            getAllPosts(post).then((data) => {
                return res.render("viewPost", {
                    post: data
                });
            })
        })
    });

    // GET THE newPost form
    app.get('/post/add', (req, res) => {
        db.Topic.findAll().then((data) => {
            return res.render("newPost", {
                topics: data
            });
        });
    });

    app.post('/api/posts/add', authHelper.isLoggedIn, (req, res) => {
        req.body['userId'] = req.user.id;
        req.user.usePoints -= 5;
        if(req.user.usePoints > 0) {
            db.User.update(req.user, { where: { id: req.user.id}}).then(function (data) {
                req.body['postDate'] = moment().unix();
                req.body['postLife'] = 60000*90;
                req.body['isPublished'] = true;
                req.body['upVotes'] = 0;
                req.body['downVotes'] = 0;
                db.Post.create(req.body).then(function (data) {
                    return res.redirect('/posts/' + data.id);
                }).catch(function (err) {
                    return res.redirect('/');
                })
            });
        } else {
            req.user+=5;
            return res.send({ message: "You do not have enough discs to make this happen."} );
        }
    });

    app.post('/api/posts/reply/:id', authHelper.isLoggedIn, (req, res) => {
        var replyToId = req.params.id;
        req.body.parentId = replyToId;
        db.Post.findOne({where: { id: replyToId}}).then((firstPost) => {
            db.Notification.create({ 
                text: "A user has replied to your post!", 
                userId: firstPost.userid, 
                isRead: false,
                url: '/posts/' + replyToId 
            }).then(() => {
                db.Post.create(req.body).then((newPost) => {
                    return res.redirect('/posts/' + newPost.id);
                })
            })            
        })
    });
    
    app.post('/api/posts/remove/:id', authHelper.isLoggedIn, (req, res) => {
        db.Post.findOne({
            where: {
                id: req.params.id
            }
        }).then((data) => {
            if (data.userId == req.user.id) {
                db.Post.update({ isPublished: false},{
                    where: {
                        id: req.params.id
                    }
                }).then((data) => {
                    return res.json({ message: "Your post has been unpublished."});
                })
            }
        })
    });
}