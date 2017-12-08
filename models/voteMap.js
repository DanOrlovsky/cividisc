module.exports = function(sequelize, DT) {
    var VoteMap = sequelize.define('VoteMap', {
        id: {
            primaryKey: true,
            autoIncrement: true,
            type: DT.INTEGER,
        },
        userId: {
            type: DT.INTEGER,
            allowNull: false,
        },
        postId: {
            type: DT.INTEGER,
            allowNull: false
        },
    });
    return VoteMap;
}