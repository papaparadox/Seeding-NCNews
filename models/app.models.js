const db = require("../db/connection");

function selectAllTopics() {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
}

function selectArticleByID(article_id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
}

function selectAllArticles() {
  return db
    .query(
      "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC"
    )
    .then(({ rows }) => {
      return rows;
    });
}

function selectCommentsByID(article_id) {
  return db
    .query("SELECT * FROM comments WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
}
module.exports = {
  selectAllTopics,
  selectArticleByID,
  selectAllArticles,
  selectCommentsByID,
};
