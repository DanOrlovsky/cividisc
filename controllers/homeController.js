const db = require('../models');
const authHelper = require('../helpers/authHelper');
const Sequelize = require('sequelize');

module.exports = function (app, passport) {

    app.get('/', (req, res) => {
        // Get top level Posts
        db.Post.findAll({where: { parentId: null, isPublished: true }, order: [[ 'postDate', "DESC"]], include: [ 'PostUser', "Topic" ]} ).then(function(posts) {
            db.Topic.findAll().then((topics) => {
                return res.render('index', { posts: posts, topics: topics });
            });
        });
    });

    app.get('/topic/:topicId', (req, res) => {
        db.Topic.findAll().then(topics => {
            db.Post.findAll({ where: { topicId: req.params.topicId, isPublished: true }, order: [[ 'postDate', "DESC"]], include: [ 'PostUser', "Topic" ]} ).then(posts => { 
                return res.render('index', {posts: posts, topics: topics });
            })
        })
    })
    
    app.post('/search', (req, res) => {
        var term = req.body.searchTerm;
        const Op = Sequelize.Op;
        if(!term) return res.redirect('/');
        db.Post.findAll({ where: { title: { [Op.like] : "%" + term + "%" } }, order: [[ 'postDate', "DESC" ]], include: [ 'PostUser', "Topic" ]} ).then((posts) => {
            db.Topic.findAll().then((topics) => {
                res.render('index', {posts: posts, topics: topics });
            })
        })
    })

}