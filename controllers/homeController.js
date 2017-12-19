const db = require('../models');
const authHelper = require('../helpers/authHelper');
const Sequelize = require('sequelize');

function RenderHomepage(req, res, posts) {
    db.Topic.findAll().then(topics => {
        return res.render('index', {posts: posts, topics: topics})
    });
}

module.exports = function (app, passport) {

    app.get('/', (req, res) => {
        // Get top level Posts
        db.Post.findAll({where: { parentId: null, isPublished: true }, order: [[ 'postDate', "DESC"], ['upVotes', 'DESC']], include: [ 'PostUser', "Topic" ]} ).then(function(posts) {
            RenderHomepage(req, res, posts);
        });
    });

    app.get('/topic/:topicId', (req, res) => {
        db.Post.findAll({ where: { topicId: req.params.topicId, isPublished: true }, order: [[ 'postDate', "DESC"]], include: [ 'PostUser', "Topic" ]} ).then(posts => { 
            RenderHomepage(req, res, posts);
        })
    })
    
    app.post('/search', (req, res) => {
        var term = req.body.searchTerm;
        const Op = Sequelize.Op;
        if(!term) return res.redirect('/');
        db.Post.findAll({ where: { title: { [Op.like] : "%" + term + "%" } }, order: [[ 'postDate', "DESC" ]], include: [ 'PostUser', "Topic" ]} ).then((posts) => {
            RenderHomepage(req, res, posts);
        })
    })
    app.get('/about', (req, res) => {
        res.render('about')
    })  
}