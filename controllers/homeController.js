const db = require('../models');
const Sequelize = require('sequelize');

const pageSize = 10;

// Function to render the homepage with posts that are passed
function RenderHomepage(req, res, posts) {
    db.Topic.findAll().then(topics => {
        var page = posts.page || 1;
        var pageCount = posts.count / pageSize;
        var limit = pageCount > 10 ? 10 : pageCount;
        return res.render('index', { pagination: { page: page, pageCount: pageCount, limit: limit }, posts: posts.rows, topics: topics})
    });
}

module.exports = function (app, passport) {

    // Sends all the available posts to the homepage
    app.get('/', (req, res) => {
        var offsetNum = req.query.page ? (req.query.page - 1) * pageSize : 0;
        db.Post.
            findAndCountAll({where: { parentId: null, isPublished: true }, 
                order: [[ 'postDate', "DESC"], ['upVotes', 'DESC']], include: [ 'PostUser', "Topic" ],
                offset: offsetNum, limit: pageSize } )
            .then(function(posts) {
                posts.page = req.query.page;
                RenderHomepage(req, res, posts);
            }
        );
    });

    // Sends posts by topic to the homepage
    app.get('/topic/:topicId', (req, res) => {
        var offsetNum = req.query.page ? (req.query.page - 1) * pageSize : 0;
        db.Post.
            findAndCountAll({ where: { topicId: req.params.topicId, isPublished: true }, 
                order: [[ 'postDate', "DESC"]], include: [ 'PostUser', "Topic" ],
            offset: offsetNum, limit: pageSize}).then(posts => { 
            RenderHomepage(req, res, posts);
        })
    })
    
    // Sends posts by search query to the homepage
    app.post('/search', (req, res) => {
        var term = req.body.searchTerm;
        const Op = Sequelize.Op;
        if(!term) return res.redirect('/');
        db.Post.findAll({ where: { title: { [Op.like] : "%" + term + "%"} }, order: [[ 'postDate', "DESC" ]], include: [ 'PostUser', "Topic" ]} ).then((posts) => {
            //RenderHomepage(req, res, posts);
            return res.render()
        })
    })

    // returns the about query
    app.get('/about', (req, res) => {
        res.render('about')
    })  
}