

module.exports = function(sequelize, DT) {
    var User = sequelize.define("User", {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DT.INTEGER,
        },
        email: {
            type: DT.STRING,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DT.STRING,
            allowNull: false,
        },
        firstName: {
            type: DT.STRING,
            notEmpty: true,
        },
        lastName: {
            type: DT.STRING,
            notEmpty: true,
        },
        displayName: {
            type: DT.STRING,
            allowNull: true,
        },
        about: {
            type: DT.STRING,
        },
        last_login: {
            type: DT.DATE,
        }
    });
    return User;
}


