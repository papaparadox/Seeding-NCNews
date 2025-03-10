const db = require("./connection");

db.query("SELECT * FROM users").then(({ rows }) => {
  console.log("All users:", rows);
}); //Gets all users from user table

db.query("SELECT * FROM articles WHERE topic = 'coding'").then(({ rows }) => {
  console.log("Coding Topics:", rows);
}); //Gets all articles from article table where topic property is set to "coding"

db.query("SELECT * FROM comments WHERE votes < 0").then(({ rows }) => {
  console.log("Comments with votes column set to less than 0:", rows);
}); //Gets all comments from comment table where comment votes set to less than 0

db.query("SELECT * FROM topics").then(({ rows }) => {
  console.log("All topics:", rows);
});

db.query("SELECT * FROM articles WHERE author = 'grumpy19'").then(
  ({ rows }) => {
    console.log("Articles by user grumpy19:", rows);
  }
);

db.query("SELECT * FROM comments WHERE votes > 10").then(({ rows }) => {
  console.log("Comments with votes column set to 10 or more:", rows);
});

db.query(
  "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url FROM articles ORDER BY created_at DESC"
).then(({ rows }) => {
  console.log(rows);
});
