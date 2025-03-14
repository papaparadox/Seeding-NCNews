const db = require("../db/connection");

function selectAllTopics() {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
}

function selectArticleByID(article_id) {
  return db
    .query(
      "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
}

function selectAllArticles(sort_by = "created_at", order = "desc") {
  if (arguments.length === 0) {
    return db
      .query(
        "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC"
      )
      .then(({ rows }) => {
        return rows;
      });
  } else {
    const validArticleColumns = [
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "article_img_url",
      "comment_count",
    ];
    const validOrder = ["asc", "desc"];
    if (!validArticleColumns.includes(sort_by) || !validOrder.includes(order)) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    } else {
      return db
        .query(
          `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url ORDER BY ${sort_by} ${order}`
        )
        .then(({ rows }) => {
          return rows;
        });
    }
  }
}

function selectArticlesByTopic(topic) {
  return db
    .query("SELECT * FROM articles WHERE topic = $1", [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    })
    .then(() => {
      return db
        .query(
          `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.topic = $1 GROUP BY articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url ORDER BY created_at DESC`,
          [topic]
        )
        .then(({ rows }) => {
          if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not found" });
          }
          return rows;
        });
    });
}

function selectCommentsByID(article_id) {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
}

function insertCommentByID(article_id, username, body) {
  return db
    .query(
      "INSERT INTO comments (article_id, author, body, created_at) VALUES($1, $2, $3, NOW()) RETURNING *",
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function updateArticleByID(votes, article_id) {
  if (!isNaN(votes)) {
    return db
      .query(
        "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
        [votes, article_id]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Not found" });
        }
        return rows[0];
      });
  } else {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  }
}

function deleteCommentByID(comment_id) {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
}

function selectAllUsers() {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
}

function selectUsersByUsername(username) {
  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
}

function updateCommentByID(votes, comment_id) {
  if (!isNaN(votes)) {
    return db
      .query(
        "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *",
        [votes, comment_id]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Not found" });
        }
        return rows[0];
      });
  } else {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  }
}
module.exports = {
  selectAllTopics,
  selectArticleByID,
  selectAllArticles,
  selectCommentsByID,
  insertCommentByID,
  updateArticleByID,
  deleteCommentByID,
  selectAllUsers,
  selectArticlesByTopic,
  selectUsersByUsername,
  updateCommentByID,
};
