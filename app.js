const express = require("express");
const app = express();

const { getTopics, getEndpoints } = require("./controllers/topics.controllers");

const {
  getArticleId,
  getAllArticles,
} = require("./controllers/articles.controllers");

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleId);

app.get("/api/articles", getAllArticles);

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
  if (err.msg === "Not found") {
    res.status(404).send({ msg: err.msg });
  }
});

module.exports = app;
