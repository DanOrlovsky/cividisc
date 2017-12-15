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
    app.get('/post/view/:id', (req, res) => {
        db.Post.findOne({
            where: {
                id: req.params.id
            }, include: [ 'PostUser' ]
        }).then((post) => {
            post.isClosed = (moment().unix() < post.postDate + post.postLife);
            getAllPosts(post).then((data) => {
                //console.log(data);
                return res.render("viewPost", {
                    post: data
                });
            })
        })
    });

    // GET THE newPost form
    app.get('/post/add', (req, res) => {
        if(!req.user.isActive) return res.render("inactiveUser");
        db.Topic.findAll().then((data) => {
            var canAddTopic = req.user.rep > 600;
            return res.render("newPost", {
                topics: data,
                canAddTopic: canAddTopic,
            });
        });
    });

    app.post('/api/posts/add', authHelper.isLoggedIn, (req, res) => {
        req.body['userId'] = req.user.id;
        req.user.usePoints -= 5;
        req.user.rep += 5;
        
        if(req.user.usePoints > 0) {
            var strMessage = '';            
            db.User.update(req.user, { where: { id: req.user.id}}).then(function (data) {
                req.body.postDate = moment().unix();
                req.body.postLife = 60*90;
                req.body.isPublished = true;
                req.body.upVotes = 0;
                req.body.downVotes = 0;
                req.body.User = req.user;
                db.Post.create(req.body).then(function (data) {
                    return res.redirect('/post/view/' + data.id);
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
            //req.body.Title
            db.User.findOne({ where: { id: firstPost.userId }}).then((user) => {
                req.body.title = "A reply to: " + user.displayName;
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