const db = require('../models');

module.exports = function(app, passport) {
    app.get('/topics/all', (req, res) => {
        db.Topic.findAll().then((data) => {
            return res.send(data);
        })
    })
    app.get('/topics/create', (req, res) => {

    })
    
    app.post('/topics/create', (res, req) => {
        if(req.user.rep < 550) return res.send({ message: "You do not have enough rep."})
        db.Topic.create(req.body).then((data) => {
            
        })
    }) 
    
}