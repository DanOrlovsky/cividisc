

module.exports = function(sequelize, DT) {
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
        

        last_login: {
            type: DT.DATE,
        }
    });

    // User.associate = function(models) {
    //     models.User.hasMany(models.Post);
    // }
    return User;
}


