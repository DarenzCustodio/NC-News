const fs = require("fs/promises");
const {
  fetchArticleId,
  fetchAllArticles,
  fetchAllArticleComments,
} = require("../models/articles.models");

exports.getArticleId = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleId(article_id)
    .then((data) => {
      res.status(200).send({ article: data });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by } = req.query;

  fetchAllArticles(sort_by)
    .then((data) => {
      res.status(200).send({ article: data });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticleComments = (req, res, next) => {
  const { article_id } = req.params;

  fetchAllArticleComments(article_id)
    .then((articleComment) => {
      res.status(200).send({ comments: articleComment });
    })
    .catch((err) => {
      next(err);
    });
};
