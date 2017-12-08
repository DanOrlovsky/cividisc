const db = require('../models');


module.exports = function (app, passport) {
    app.get('/', (req, res) => {
        res.render('index');
    })
/*
    app.get('/', function (req, res) {
        console.log("User", req.user);
        if (req.user != null) {
            db.Item.findAll({
                where: { userId: req.user.id } }).then((data) => {
                res.render('index', {
                    user: req.user,
                    items: data
                });
            });
        } else {
            res.render('index');
        }
    });
*/
/*    app.post('/api/items/add', function (req, res) {
        db.Item.create({
            url: req.body.txtUrl,
            post: req.body.txtPost,
            UserId: req.user.id
        }).then(function (data) {
            res.render('index', {
                user: req.user,
                postMesage: "Item Successfully Added!"
            });
        }).catch(function (err) {
            console.log(err);
            res.end();
        });
    });
    */
}