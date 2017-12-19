const db = require('../models');
const authHelper = require('../helpers/authHelper');
const _ = require('underscore');
const moment = require("moment");

// Function that recursively gets all children posts
function getAllPosts(post) {
    return new Promise(function (resolve, reject) {
        db.Post.findAll({
            where: {
                parentId: post.id
            }, include: [ "PostUser", "Topic" ]
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
            }, include: [ 'PostUser', 'Topic' ]
        }).then((post) => {
            post.isClosed = (moment().unix() < post.postDate + post.postLife);
            getAllPosts(post).then((data) => {
                return res.render("viewPost", {
                    post: data,
                });
            })
        })
    });

    // GET THE newPost form
    app.get('/post/add', authHelper.isLoggedIn, (req, res) => {
        if(!req.user.isActive) return res.render("inactiveUser");
        db.Topic.findAll().then((data) => {
            var canAddTopic = req.user.rep > 600;
            return res.render("newPost", {
                topics: data,
                canAddTopic: canAddTopic,
            });
        });
    });

    app.post('/posts/add',  (req, res) => {
        if(!req.user) return res.json({ message: "You must be logged in to perform this action."})
        if(!req.user.isActive) return res.json({ message: "Sorry, you are not an active user at this time" });
        if(req.body.topicId == -1) return res.json({ message: "Please select a topic" });
        req.body.userId = req.user.id;
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

    app.post('/posts/reply/:id', (req, res) => {
        if(!req.user) return res.json({ message: "You must be logged in to perform this action."})
        var replyToId = req.params.id;
        var returnPost;
        req.user.usePoints -= 5;
        req.user.rep += 5;
        if(req.user.usePoints >= 0) {
            req.body.parentId = replyToId;
            req.body.postDate = moment().unix();
            req.body.postLife = 60*90;
            req.body.isPublished = true;
            req.body.upVotes = 0;
            req.body.downVotes = 0;
            
            //req.body.User = req.user;
            req.body.userId = req.user.id;
            db.Post.findOne({where: { id: replyToId}}).then((firstPost) => {
                returnPost = firstPost;
                req.body.topicId = firstPost.topicId;
                if(timeLeft = (firstPost.postDate + firstPost.postLife) - moment().unix() > 0)
                {
                    db.User.findOne({ where: { id: firstPost.userId }}).then((user) => {
                        req.body.title = "A reply to: " + user.displayName;
                        db.Notification.create({ 
                            text: "A user has replied to your post!", 
                            userId: firstPost.userid, 
                            isRead: false,
                            url: '/post/view/' + replyToId 
                        }).then(() => {
                            db.User.update(req.user, { where : { id: req.user.id }}).then(() => {
                                db.Post.create(req.body).then((newPost) => {
                                    res.status(200).json({
                                        message: "Reply posted successfully",
                                        newPostId: returnPost.id,
                                    })
                                })
                            })
                        })            
                    })
                } else {
                    return res.json({ message: "This post has been closed."});
                }
            })
        } else {
            return res.json({ message: "You do not have enough Discs to make this happen"})
        }
    });
    
    app.post('/posts/remove/:id', authHelper.isLoggedIn, (req, res) => {
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