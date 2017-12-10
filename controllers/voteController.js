const authHelper = require('../helpers/authHelper');
const db = require('../models');

module.exports = function(app, passport) {
    app.post('/vote/upvote/:id', authHelper.isLoggedIn, (req, res) => {


        db.VoteMap.findOne({where: { userId: req.user.id, postId: req.params.id }})
            .then((voted) => {
            console.log(voted);
            if(voted) { 
                //db.VoteMap.destroy(voted);
                return res.json({ message: "Cannot vote more than once"});
            }
            if((req.user.usePoints - 1) > 0) {
                    req.user.usePoints--;
                    req.user.rep++;
                    req.user.timesVotedUp++;
                    db.VoteMap.create({ userId: req.user.id, postId: req.params.id })
                        .then(() => db.Post.findOne({ where: { id: req.params.id }}))
                        .then(post => db.User.findOne({ where: { id: post.userId }} )
                                             .then(user => { return { post, user } }))
                        .then(({ post, user}) => {
                            console.log("Post: ", post);
                            console.log("User: ", user);
                            post.upVotes++;
                            user.upVotes++;
                            user.rep += 10;
                            user.usePoints += 10;
                            return db.Notification.create({
                                userId: user.id, 
                                url: '/posts/' + post.id, 
                                isRead: false, 
                                text: "Your comment has been voted up!"                                 
                            })
                            .then(() => {
                                console.log("Updating");
                                let updating = [];
                                updating.push(user.update({ upVotes: user.upVotes, rep: user.Rep }));
                                updating.push(db.User.update(req.user, {where: {id: req.user.id }}));
                                updating.push(post.update({ upVotes: post.upVotes }));
                                return Promise.all(updating);
                            }).catch((err) => console.log(err));
                        })
                        .then(() => res.json({ message: "Vote cast!", upVotes: post.upVotes }))
                        .catch(err => res.json({ message: "Error happened" }) )

            } else {
                return res.json({ message: "You don't have enough points to do this now"});
            }
        });
    });
    app.post('/vote/downvote/:id', authHelper.isLoggedIn, (req, res) => {
        db.VoteMap.findOne({where: { userId: req.user.id, postId: req.params.id }})
        .then((voted) => {
        console.log(voted);
        if(voted) { 
            //db.VoteMap.destroy(voted);
            return res.json({ message: "Cannot vote more than once"});
        }
        if((req.user.usePoints - 10) > 0) {
                req.user.usePoints-=10;
                req.user.rep++;
                req.user.timesVotedDown++;
                db.VoteMap.create({ userId: req.user.id, postId: req.params.id })
                    .then(() => db.Post.findOne({ where: { id: req.params.id }}))
                    .then(post => db.User.findOne({ where: { id: post.userId }} )
                                         .then(user => { return { post, user } }))
                    .then(({ post, user}) => {
                        post.downVotes++;
                        user.downVotes++;
                        user.rep--;
                        return db.Notification.create({
                            userId: user.id, 
                            url: '/posts/' + post.id, 
                            isRead: false, 
                            text: "Your comment has been voted up!"                                 
                        })
                        .then(() => {
                            console.log("Updating");
                            let updating = [];
                            updating.push(user.update({ upVotes: user.upVotes, rep: user.Rep }));
                            updating.push(db.User.update(req.user, {where: {id: req.user.id }}));
                            updating.push(post.update({ upVotes: post.upVotes }));
                            return Promise.all(updating);
                        }).catch((err) => console.log(err));
                    })
                    .then(() => res.json({ message: "Vote cast!", downVotes: post.downVotes }))
                    .catch(err => res.json({ message: "Error happened" }) )

            } else {
                return res.json({ message: "You don't have enough points to do this now"});
            }
        });
    })

}

    /*console.log("Downvote!");
        var dbUser, dbPost;
        db.VoteMap.findOne({where: { userId: req.user.id, postId: req.params.id }}).then((voted) => {
            if(voted) return res.json({ message: "Cannot vote more than once"});
            if((req.user.usePoints - 10) > 0) {
                db.VoteMap.create({ userId: req.user.id, postId: req.params.id }).then(() => {
                    req.user.usePoints-=10;
                    req.user.timesVotedDown++;
                    db.Post.findOne({ where: { id: req.params.id }}).then((post) => {
                        post.downVotes++;
                        db.User.findOne({ where: { id: post.userId }} ).then((user) => {
                            user.downVotes++;
                            user.rep--;
                            console.log("UserId: " + user.id);
                            console.log("Req.UserId: " + req.user.id);
                            console.log("PostId: " + post.id);
                            user.update({ rep: user.rep, downVotes: user.downVotes }).then(() => {
                            //db.User.update(user, {where: { id: user.id }}).then((usUP) => {
                                console.log('updated user');
                                db.User.update(req.user, { where: { id: req.user.id }}).then(() => {
                                    post.update({downVotes: post.downVotes}).then(() => {
                                    //db.Post.update(post, {where: { id: post.id }}).then(() => {
                                        console.log("VOTE COMPLETE!");
                                        return res.json({ message: "You have successfully voted!" });

                                    })
                                })
                            })
                            
                        })
                    })
                })
            } else {
                return res.json({ message: "You don't have enough points to do this now"});
            }
        });*/


/*

    app.post('/vote/upvote/:id', authHelper.isLoggedIn, (req, res) => {
        db.VoteMap.findOne({where: { userId: req.user.id, postId: req.params.id }}).then((voted) => {
            if(voted) return res.json({ message: "Cannot vote more than once"});
            if((req.user.usePoints - 1) > 0) {
                db.VoteMap.create({ userId: req.user.id, postId: req.params.id }).then(() => {
                    req.user.usePoints--;
                    
                    db.Post.findOne({ where: { id: req.params.id }}).then((post) => {
                        post.upVotes++;
                        db.User.findOne({ where: { id: post.userId }} ).then((user) => {
                            user.upVotes++;
                            user.rep += 10;
                            user.usePoints += 10;
                            db.Notification.create({ userId: user.id, url: '/posts/' + post.id, isRead: false, 
                                text: "Your comment has been voted up!" }).then(() => {
                                db.User.update(user, {where: { id: user.id}}).then(() => {
                                    db.User.update(req.user, {where: {id: req.user.id }}).then(() => {
                                        db.Post.update(post, {where: { id: post.id }}).then(() => {

                                            return res.json({ message: "You have successfully voted!" });

                                        }).catch((err) => { return res.json({ message: "Error happened" })})
                                    }).catch((err) => { return res.json({ message: "Error happened" })})
                                }).catch((err) => { return res.json({ message: "Error happened" })})
                            }).catch((err) => { return res.json({ message: "Error happened" })})
                        })
                    })
                })
            } else {
                return res.json({ message: "You don't have enough points to do this now"});
            }
        });
    });
*/