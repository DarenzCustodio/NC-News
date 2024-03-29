const db = require("../db/connection");

exports.fetchArticleId = (article_id) => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,  COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [article_id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return res.rows[0];
    });
};

exports.fetchAllArticles = (sort_by, topic) => {
  let query = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,  COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id `;

  const allowedQuery = ["created_at"];

  if (topic && sort_by === undefined) {
    return db
      .query(
        `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE topic = '${topic}' GROUP BY articles.article_id ORDER BY created_at DESC;`
      )
      .then((res) => {
        if (res.rows.length === 0) {
          return Promise.reject({ status: 400, msg: "Bad request" });
        }
        return res.rows;
      });
  }

  if (topic === undefined) {
    return db
      .query(
        `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,  COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC`
      )
      .then((res) => {
        return res.rows;
      });
  }

  if (!allowedQuery.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort by query" });
  } else {
    query += ` ORDER BY ${sort_by} DESC;`;
  }
  return db.query(query).then((res) => {
    return res.rows;
  });
};

exports.fetchAllArticleComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then((res) => {
      return res.rows;
    });
};

exports.addCommentData = (addComment, article_id) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id, created_at, votes)
        VALUES ($1, $2, $3, $4, $5) RETURNING*;`,
      [addComment.username, addComment.body, article_id, new Date(), 0]
    )
    .then((addComment) => {
      return addComment.rows[0];
    });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*;`,
      [inc_votes, article_id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return res.rows[0];
    });
};
