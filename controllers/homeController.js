const db = require('../models');
const Sequelize = require('sequelize');


// Function to render the homepage with posts that are passed
function RenderHomepage(req, res, posts) {
    db.Topic.findAll().then(topics => {
        return res.render('index', {posts: posts, topics: topics})
    });
}

module.exports = function (app, passport) {

    // Sends all the available posts to the homepage
    app.get('/', (req, res) => {
        // Get top level Posts
        db.Post.findAll({where: { parentId: null, isPublished: true }, order: [[ 'postDate', "DESC"], ['upVotes', 'DESC']], include: [ 'PostUser', "Topic" ]} ).then(function(posts) {
            RenderHomepage(req, res, posts);
        });
    });

    // Sends posts by topic to the homepage
    app.get('/topic/:topicId', (req, res) => {
        db.Post.findAll({ where: { topicId: req.params.topicId, isPublished: true }, order: [[ 'postDate', "DESC"]], include: [ 'PostUser', "Topic" ]} ).then(posts => { 
            RenderHomepage(req, res, posts);
        })
    })
    
    // Sends posts by search query to the homepage
    app.post('/search', (req, res) => {
        var term = req.body.searchTerm;
        const Op = Sequelize.Op;
        if(!term) return res.redirect('/');
        db.Post.findAll({ where: { title: { [Op.like] : "%" + term + "%"} }, order: [[ 'postDate', "DESC" ]], include: [ 'PostUser', "Topic" ]} ).then((posts) => {
            RenderHomepage(req, res, posts);
        })
    })

    // returns the about query
    app.get('/about', (req, res) => {
        res.render('about')
    })  
}