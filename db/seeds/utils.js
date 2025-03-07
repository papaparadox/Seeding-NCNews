const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.updateComments = (commentData, articleData) => {
  const obj = {};
  articleData.forEach((article) => {
    obj[article.title] = article.article_id;
  });
  return commentData.map((comment) => {
    comment.article_id = obj[comment.article_title];
    return comment;
  });
};
//format the comments
//takes the rows which will be article data. take the comments data.
//need to check which article_id belongs to article_title
//need to update the comments to have article_id instead of article_title

// try to use ternary to check if id belongs to title
//use normal if statement return the desired one
