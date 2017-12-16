const moment = require('moment');
const path = require('path');
function hbsHelpers(hbs) {
    
    return hbs.create({
        defaultLayout: 'main',
        helpers: {
            ifTimeLeft: function(postDate, postLife) {
                //console.log(postDate);
                //console.log(postLife);
                //console.log(block);
                let timeLeft = (postDate + postLife) - moment().unix();
                if(timeLeft > 0) return true;
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