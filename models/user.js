var db = require('./index')

module.exports = function (sequelize, DT) {
    var User = sequelize.define("User", {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DT.INTEGER,
        },
        // USER EMAIL
        email: {
            type: DT.STRING,
            validate: {
                isEmail: true,
            },
        },

        // PASSWORD
        password: {
            type: DT.STRING,
            allowNull: false,
        },

        // FIRST NAME
        firstName: {
            type: DT.STRING,
            notEmpty: true,
        },

        // LAST NAME
        lastName: {
            type: DT.STRING,
            notEmpty: true,
        },

        // DISPLAY NAME
        displayName: {
            type: DT.STRING,
            allowNull: true,
        },

        // UPVOTES
        upVotes: DT.INTEGER,

        // DOWN VOTES
        downVotes: DT.INTEGER,

        // TIMES USER VOTED UP
        timesVotedUp: DT.INTEGER,

        // TIMES USER VOTED DOWN
        timesVotedDown: DT.INTEGER,

        // REPUTATION
        rep: DT.INTEGER,

        usePoints: DT.INTEGER,

        // ABOUT
        about: DT.STRING,

        imageUrl: DT.STRING,

        isActive: DT.BOOLEAN,

        last_login: {
            type: DT.DATE,
        }
    }, {
        instanceMethods: {
            addRep: function (rep) {
                this.rep += rep;
                if (this.rep > 150) {
                    db.Notification.create({
                        text: "You can now add a custom user avatar!",
                        userId: this.id,
                        url: '/dashboard',
                        isRead: false,
                    }).then(() => {
                        return;
                    })
                }
            }
        }
    });



    return User;
}