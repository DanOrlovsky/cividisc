module.exports = function(sequelize, DT) {
    var Topic = sequelize.define('Topic', {
        id: {
            type: DT.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DT.STRING,
            allowNull: false,
        },
    });
    return Topic;
}