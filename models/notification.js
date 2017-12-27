module.exports = function(sequelize, DT) {
   
    var Notification = sequelize.define('Notification', {
        id: {
            type: DT.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        text: {
            type: DT.STRING,
            allowNull: false,
        },
        userId: DT.INTEGER,
        url: DT.STRING,
        isRead: DT.BOOLEAN,
    });
    return Notification;
}