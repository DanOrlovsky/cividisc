const db = require('../models');
const authHelper = require('../helpers/authHelper');
const Sequelize = require('sequelize');
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
    });

    app.post('/search', (req, res) => {
        var term = req.body.searchTerm;
        const Op = Sequelize.Op;
        if(!term) return res.redirect('/');
        db.Post.findAll({ where: { title: { [Op.like] : "%" + term + "%" } }, order: [[ 'postDate', "DESC" ]] }).then((posts) => {
            res.render('index', {posts: posts });
        })
    })

    app.get('/api/notifications', (req, res) => {
        if(req.user) {
            db.Notification.findAll({ where: { userId: req.user.id, isRead: false }}).then((data) => {
                return res.json(data);
            })
        }
    })
}