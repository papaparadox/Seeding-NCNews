const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, updateComments } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments CASCADE`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles CASCADE`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users CASCADE`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics CASCADE`);
    })
    .then(() => {
      return db.query(`CREATE TABLE topics (
      slug VARCHAR PRIMARY KEY NOT NULL,
      description VARCHAR NOT NULL,
      img_url VARCHAR(1000))
      `);
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
        username VARCHAR PRIMARY KEY NOT NULL,
        name VARCHAR NOT NULL,
        avatar_url VARCHAR(1000))`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        topic VARCHAR REFERENCES topics(slug),
        author VARCHAR REFERENCES users(username),
        body TEXT NOT NULL,
        created_at TIMESTAMP,
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000))`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id),
        body TEXT NOT NULL,
        votes INT DEFAULT 0,
        author VARCHAR REFERENCES users(username),
        created_at TIMESTAMP)`);
    })
    .then(() => {
      const topicInsert = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L`,
        topicData.map((topic) => {
          return [topic.slug, topic.description, topic.img_url];
        })
      );
      return db.query(topicInsert);
    })
    .then(() => {
      const userInsert = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L`,
        userData.map((user) => {
          return [user.username, user.name, user.avatar_url];
        })
      );
      return db.query(userInsert);
    })
    .then(() => {
      const articleInsert = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        articleData.map((article) => {
          const {
            title,
            topic,
            author,
            body,
            created_at,
            votes,
            article_img_url,
          } = convertTimestampToDate(article);
          return [
            title,
            topic,
            author,
            body,
            created_at,
            votes,
            article_img_url,
          ];
        })
      );
      return db.query(articleInsert);
    })
    .then(({ rows }) => {
      const commentDataWithArticleID = updateComments(commentData, rows);
      console.log(commentDataWithArticleID);
      const commentInsert = format(
        `INSERT INTO comments(article_id, body, votes, author, created_at) VALUES %L`,
        commentDataWithArticleID.map((comment) => {
          const { article_id, body, votes, author, created_at } =
            convertTimestampToDate(comment);
          return [article_id, body, votes, author, created_at];
        })
      );
      return db.query(commentInsert);
    });
};
module.exports = seed;
