const express = require("express");
const app = express();
app.use(express.json());
const { getTopics, getEndpoints } = require("./controllers/topics.controllers");

const {
  getArticleId,
  getAllArticles,
  getAllArticleComments,
  postComment,
  patchArticleVotes,
} = require("./controllers/articles.controllers");

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleId);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getAllArticleComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg === "Not found") {
    res.status(404).send({ msg: err.msg });
  } else {
    next(err);
  }
});

module.exports = app;
