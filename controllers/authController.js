
module.exports = function(app, passport) { 
 
    app.get('/signup', function(req, res) {
        res.render('accounts/signup');
    });
    app.get('/login', function(req, res) { 
        res.render('accounts/login');
    });
    app.get('/dashboard', function(req, res) {
        res.render('accounts/dashboard', req.user);
    });
    app.get('/logout', function(req, res) {
        req.session.destroy(function(err) {
            res.redirect('/');
        });
    });
    app.post('/signup', function(req, res, next) { 
        var user = req.body;
        if(user.email === '' || user.password==='' || user.firstname==='' || user.lastname==='') 
            return res.render('accounts/signup', { message: "Please fill out the form completely" });
        passport.authenticate('local-signup', (err, user, info) => {
            if(err) return next(err)
            if(!user) {
                return res.render('accounts/signup', { message: info.message });
            }
            req.logIn(user, function(err) {
                if(err) return next(err);
                return res.redirect('/');
            })
        })(req, res, next);
    }); 

    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if(err) return next(err);
            if(!user) {
                return res.render('accounts/login', { message: info.message });
            }
            req.logIn(user, function(err) { 
                if(err) return next(err);
                return res.redirect('/');
            })
        })(req, res, next); 
    });
}