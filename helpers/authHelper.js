var authHelper = {
    userHasRep: function(db, userId) {
        return new Promise(function(resolve, reject) {
            db.User.findOne({ where: { id: userId } }).then((data) => {
                if (data.rep > 0) {
                    resolve(true);
                } else resolve(false)
            }).catch((err) => {
                console.log(err);
                resolve(false);
            });
        });
    },

    isLoggedIn: function (req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect('/login');
        }
    }
}
module.exports = authHelper;