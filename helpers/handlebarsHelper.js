const moment = require('moment');

function hbsHelpers(hbs) {
    
    return hbs.create({
        defaultLayout: 'main',
        helpers: {
            ifTimeLeft: function(postDate, postLife) {
                
                let timeLeft = (postDate + postLife) - moment().unix();
                return timeLeft > 0 ? true : false;
            },
            getTimeLeft: function(postDate, postLife) {
                return postDate + postLife - moment().unix();
            },
        }
    })
}

module.exports = hbsHelpers;