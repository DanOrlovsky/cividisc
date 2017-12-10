const db = require('../models');
const authHelper = require('../helpers/authHelper');

module.exports = function (app, passport) {
    app.get('/', (req, res) => {
        // Get top level Posts
        db.Post.findAll({where: { parentId: null, isPublished: true }, order: [[ 'postDate', "DESC"]]}).then((posts) => {
            res.render('index', { posts: posts });
        });
    });
    app.get('/closed', (req, res) => {
        db.Post.findAll().then((posts) => {
            
        })
    })
}