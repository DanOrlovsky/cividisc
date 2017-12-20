const userHelper = require('../helpers/userHelper');
const db = require('../models');

module.exports = function(app, passport) {
    app.put('/vote/upvote/:id', (req, res) => {
        if(!req.user) return res.json({ message: "You must log in to vote" });
        if(!req.user.isActive) return res.json({ message: "Sorry, you are not an active user at this time" });
        var upVotes;
        db.VoteMap.findOne({where: { userId: req.user.id, postId: req.params.id }})
            .then((voted) => {
            if(voted) { 
                //db.VoteMap.destroy(voted);
                return res.json({ message: "Cannot vote more than once"});
            }
            if((req.user.usePoints - 1) > 0) {
                req.user.usePoints--;
                req.user.rep+=5;
                req.user.timesVotedUp++;
                db.VoteMap.create({ userId: req.user.id, postId: req.params.id })
                    .then(() => db.Post.findOne({ where: { id: req.params.id }}))
                    .then(post => db.User.findOne({ where: { id: post.userId }} )
                                            .then(user => { return { post, user } }))
                    .then(({ post, user}) => {
                        post.upVotes++;
                        upVotes = post.upVotes;
                        post.postLife += (60*5);  //5 minutes
                        user.upVotes++;
                        user.rep += 10;
                        user.usePoints += 10;
                        return db.Notification.create({
                            userId: user.id, 
                            url: '/post/view/' + post.id, 
                            isRead: false, 
                            text: "Your post has been voted up and you've received more Discs!"                                 
                        })
                        .then(() => {
                            let updating = [];
                            updating.push(user.update({ upVotes: user.upVotes, rep: user.Rep }));
                            updating.push(db.User.update(req.user, {where: {id: req.user.id }}));
                            updating.push(post.update({ upVotes: post.upVotes, postLife: post.postLife }));
                            return Promise.all(updating);
                        }).catch((err) => console.log(err));
                    })
                .then(() => res.json({ message: "Vote cast!", upVotes: upVotes }))
                .catch(err => { console.log(err); res.json({ message: "Error happened" })} )

            } else {
                return res.json({ message: "You don't have enough points to do this now"});
            }
        });
    });
    app.put('/vote/downvote/:id', (req, res) => {
        var downVotes;
        if(!req.user) return res.json({ message: "You must log in to vote" });
        if(!req.user.isActive) return res.json({ message: "Sorry, you are not an active user at this time" });
        db.VoteMap.findOne({where: { userId: req.user.id, postId: req.params.id }})
        .then((voted) => {
        if(voted) { 
            //db.VoteMap.destroy(voted);
            return res.json({ message: "Cannot vote more than once"});
        }
        if((req.user.usePoints - 10) > 0) {
                
            req.user.usePoints-=10;
            req.user.timesVotedDown++;
            
            // If the user is more likely to upvote, chances are this is a legitimate downvote.
            if(req.user.timesVotedUp > (req.user.timesVotedDown * 2)) {
                req.user.rep+=2;
                req.user.usePoints += 5;
            // If the user is a perpetual down-voter...
            } else if(req.user.timesVotedDown > (req.user.timesVotedUp * 3)) {
                // Move their rep down
                req.user.rep-=5;
                // Tax them harder on use points
                req.user.usePoints -= 5; 
            }

            db.VoteMap.create({ userId: req.user.id, postId: req.params.id })
                .then(() => db.Post.findOne({ where: { id: req.params.id }}))
                .then(post => db.User.findOne({ where: { id: post.userId }} )
                                        .then(user => { return { post, user } }))
                .then(({ post, user}) => {
                    post.downVotes++;
                    post.postLife -= 60*5;
                    downVotes = post.downVotes;
                    user.downVotes++;
                    user.rep--;
                        let updating = [];
                        updating.push(user.update({ downVotes: user.downVotes, rep: user.Rep }));
                        updating.push(db.User.update(req.user, {where: {id: req.user.id }}));
                        updating.push(post.update({ downVotes: post.downVotes, postLife: post.postLife }));
                        return Promise.all(updating);
                })
                .then(() => res.json({ message: "Vote cast!", downVotes: downVotes }))
                .catch(err => res.json({ message: "Error happened" }))

            } else {
                return res.json({ message: "You don't have enough points to do this now"});
            }
        });
    })

}

