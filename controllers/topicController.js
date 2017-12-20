const db = require('../models');
const userHelper = require('../helpers/userHelper');


module.exports = function(app, passport) {
    app.get('/topics/all', (req, res) => {
        db.Topic.findAll().then((data) => {
            return res.send(data);
        })
    })
    app.post('/topics/create', userHelper.isLoggedIn, (req, res) => {
        if(req.user.rep < 600) return res.send({ message: "You do not have enough rep."})
        db.Topic.findOne({ where: { name: req.body.name }}).then(topic => {
            if(topic) {
                return res.json(topic);
            }
            db.Topic.create(req.body).then((data) => {
                return res.json(data);
            })
        })
    }) 
    
}