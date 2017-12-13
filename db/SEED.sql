#DROP DATABASE IF EXISTS civiDisc_db;
#CREATE DATABASE civiDisc_db;
use civiDisc_db;

INSERT INTO users(email, password, firstName, lastName, displayName, upVotes, downVotes, timesVotedUp, timesVotedDown, rep, usePoints, isActive, createdAt, updatedAt)
VALUES("mail@mail.com", "$08$npKey.NWl4DaUMGbkk76kuBpmsuz2Y6RaQsBdj1lA0MOhfaneZo8e", "Robert", "Ginny", "RobGinnd", 10, 15, 5, 15, 200, 220, true, "2017-12-11 18:35:37", "2017-12-11 18:35:37");

INSERT INTO users(email, password, firstName, lastName, displayName, upVotes, downVotes, timesVotedUp, timesVotedDown, rep, usePoints, isActive, createdAt, updatedAt)
VALUES("person@mail.com", "$08$npKey.NWl4DaUMGbkk76kuBpmsuz2Y6RaQsBdj1lA0MOhfaneZo8e", "Sasha", "Cohen", "SaCo", 40, 2, 5, 15, 300, 220, true, "2017-12-11 18:35:37", "2017-12-11 18:35:37");

INSERT INTO users(email, password, firstName, lastName, displayName, upVotes, downVotes, timesVotedUp, timesVotedDown, rep, usePoints, isActive, createdAt, updatedAt)
VALUES("rachel@mail.com", "$08$npKey.NWl4DaUMGbkk76kuBpmsuz2Y6RaQsBdj1lA0MOhfaneZo8e", "Rachel", "Rocker", "RachRock", 10, 15, 5, 15, 200, 220, true, "2017-12-11 18:35:37", "2017-12-11 18:35:37");

INSERT INTO notifications(text, userId, url, isRead, createdAt, updatedAt)
VALUES ("You have a notification!", 1, "/post/view/1", false, "2017-12-11 18:35:37", "2017-12-11 18:35:37");
INSERT INTO notifications(text, userId, url, isRead, createdAt, updatedAt)
VALUES ("You have a notification!", 1, "/post/view/1", false, "2017-12-11 18:35:37", "2017-12-11 18:35:37");
INSERT INTO notifications(text, userId, url, isRead, createdAt, updatedAt)
VALUES ("You have a notification!", 2, "/post/view/1", false, "2017-12-11 18:35:37", "2017-12-11 18:35:37");

INSERT INTO topics(name, createdAt, updatedAt) VALUES("Tech", "2017-12-11 18:35:37", "2017-12-11 18:35:37");
INSERT INTO topics(name, createdAt, updatedAt) VALUES("Politics", "2017-12-11 18:35:37", "2017-12-11 18:35:37");
INSERT INTO topics(name, createdAt, updatedAt) VALUES("NC", "2017-12-11 18:35:37", "2017-12-11 18:35:37");
INSERT INTO topics(name, createdAt, updatedAt) VALUES("Weather", "2017-12-11 18:35:37", "2017-12-11 18:35:37");

INSERT INTO posts(title, url, topicId, userId, postDate, postLife, isPublished, upVotes, downVotes, createdAt, updatedAt, comment)
VALUES ("I thought this was interesting", "http://google.com", 1, 1, 1513123651, 800000, true, 15, 5, "2017-12-11 18:35:37", "2017-12-11 18:35:37", "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.");
INSERT INTO posts(title, url, topicId, userId, postDate, postLife, isPublished, upVotes, downVotes, createdAt, updatedAt, comment)
VALUES ("Can someone explain this?", "http://google.com", 1, 2, 1513123651, 800000, true, 15, 5, "2017-12-11 18:35:37", "2017-12-11 18:35:37", "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.");
INSERT INTO posts(title, url, topicId, userId, postDate, postLife, isPublished, upVotes, downVotes, createdAt, updatedAt, comment)
VALUES ("What in the world?", "http://google.com", 3, 2, 1513123651, 800000, true, 15, 5, "2017-12-11 18:35:37", "2017-12-11 18:35:37", "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.");
INSERT INTO posts(title, url, topicId, userId, postDate, postLife, isPublished, upVotes, downVotes, createdAt, updatedAt, comment)
VALUES ("I can't even.", "http://google.com", 1, 1, 1513123651, 800000, true, 15, 5, "2017-12-11 18:35:37", "2017-12-11 18:35:37", "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.");
INSERT INTO posts(parentId, title, url, topicId, userId, postDate, postLife, isPublished, upVotes, downVotes, createdAt, updatedAt, comment)
VALUES (1, "What in the world?", "http://google.com", 3, 2, 1513123651, 800000, true, 15, 5, "2017-12-11 18:35:37", "2017-12-11 18:35:37", "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.");
INSERT INTO posts(parentId, title, url, topicId, userId, postDate, postLife, isPublished, upVotes, downVotes, createdAt, updatedAt, comment)
VALUES (1, "I can't even.", "http://google.com", 1, 1, 1513123651, 800000, true, 15, 5, "2017-12-11 18:35:37", "2017-12-11 18:35:37", "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.");
