const moment = require('moment');
const path = require('path');
const db = require('../models');
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
            // RETURNS CURRENT YEAR FOR COPYRIGHT.  
            getYear: function() {
                return moment().format("YYYY");
            },
//            userHasUnreadNotifications: function(id) {
//                db.Notification.count({ where: { userId: id, isRead: false}}).then(count => {
//                    return count>0;
//                })
//            }        
        }
    })
}

module.exports = hbsHelpers;