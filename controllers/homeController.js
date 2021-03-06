const db = require('../models');
const Sequelize = require('sequelize');

const pageSize = 10;

// Function to render the homepage with posts that are passed
function RenderHomepage(req, res, posts, searched=false) {
    db.Topic.findAll({ order: [[ 'name', 'ASC']]}).then(topics => {
        var page = posts.page || 1;
        var pageCount = Math.ceil(posts.count / pageSize);
        var limit = pageCount > 10 ? 10 : pageCount;
        if(!searched) return res.render('index', { pagination: { page: page, pageCount: pageCount, limit: limit }, posts: posts.rows, topics: topics})
        else return res.render('index', {posts: posts, topics: topics, noPagination: true})
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
                var promises = [];
                
                for(var i = 0; i < posts.rows.length; i++) {
                    promises.push(new Promise(function(resolve, reject) { 
                        db.Post.count({ where: { parentId: posts.rows[i].id}}).then(count => {  resolve(count); })
                    }));
                }
                Promise.all(promises).then((counts) => {
                    for(var i = 0; i < counts.length; i++) {
                        posts.rows[i].count = counts[i];
                    }
                    //posts.page = req.query.page;
                    RenderHomepage(req, res, posts);
                })
            }
        );
    });

    // Sends posts by topic to the homepage
    app.get('/topic/:topicId', (req, res) => {
        var offsetNum = req.query.page ? (req.query.page - 1) * pageSize : 0;
        db.Post.
            findAndCountAll({ where: { topicId: req.params.topicId, isPublished: true }, 
                order: [[ 'postDate', "ASC"]], include: [ 'PostUser', "Topic" ],
            offset: offsetNum, limit: pageSize}).then(posts => { 
                var promises = [];
                for(var i = 0; i < posts.rows.length; i++) {
                    promises.push(new Promise(function(resolve, reject) { 
                        db.Post.count({ where: {parentId: posts.rows[i].id}}).then(count => {resolve(count); })
                    }));
                }
                Promise.all(promises).then((counts) => {
                    for(var i = 0; i < counts.length; i++) {
                        posts.rows[i].count = counts[i];
                    }
                    RenderHomepage(req, res, posts);
                })
            }
        )
    })
    
    // Sends posts by search query to the homepage
    app.post('/search', (req, res) => {
        var term = req.body.searchTerm;
        const Op = Sequelize.Op;
        if(!term) return res.redirect('/');
        db.Post.findAll({ where: { title: { [Op.like] : "%" + term + "%"} }, order: [[ 'postDate', "DESC" ]], include: [ 'PostUser', "Topic" ]} ).then((posts) => {
            RenderHomepage(req, res, posts, searched=true);
            //return res.render()
        })
    })

    // returns the about query
    app.get('/about', (req, res) => {
        res.render('about')
    })  
}