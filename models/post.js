module.exports = function(sequelize, DT) {
    var Post = sequelize.define('Post', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DT.INTEGER,
        },
        title: {
            type: DT.STRING,
            allowNull: false,
        },
        comment: DT.STRING,
        url: {
            type: DT.STRING,
            allowNull: true,
        },
        topicId: {
            type: DT.INTEGER,
            allowNull: true,
        },
        userId: {
            type: DT.INTEGER,
            allowNull: false,
        },
        postDate: {
            type: DT.INTEGER,
            allowNull: false,
        },
        postLife: {
            type: DT.INTEGER,
            allowNull: false,
        },
        
        isPublished: DT.BOOLEAN,
        parentId: DT.INTEGER,
        upVotes: DT.INTEGER,
        downVotes: DT.INTEGER,
        timeLeftMs: DT.INTEGER,
        threadClosed: DT.BOOLEAN,
    });
    
    Post.associate = function(models) {
        models.Post.hasOne(models.User);
        models.Post.hasOne(models.Topic);
    }
    return Post;
}