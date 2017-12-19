const moment = require('moment');
const path = require('path');
function hbsHelpers(hbs) {
    
    return hbs.create({
        defaultLayout: 'main',
        helpers: {
            ifTimeLeft: function(postDate, postLife) {
                let timeLeft = (postDate + postLife) - moment().unix();
                if(timeLeft > 0) return true;
            },
            canAddAvatar: function(rep) {
                return rep > 150;
            },
            getTimeLeft: function(postDate, postLife) {
                var timeLeft = (postDate + postLife - moment().unix()) / 60;
                if(timeLeft < 0) timeLeft = 0; 
                return moment(timeLeft);
            },
        }
    })
}

module.exports = hbsHelpers;