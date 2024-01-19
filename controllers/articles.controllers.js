const fs = require("fs/promises");
const {
  fetchArticleId,
  fetchAllArticles,
  fetchAllArticleComments,
  addCommentData,
  updateArticleVotes,
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
  const { topic } = req.query;

  fetchAllArticles(sort_by, topic)
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

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const addComment = req.body;

  addCommentData(addComment, article_id)
    .then((data) => {
      res.status(201).send({ comment: data });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  updateArticleVotes(article_id, inc_votes)
    .then((updateArticleVotes) => {
      res.status(200).send({ updatedArticle: updateArticleVotes });
    })
    .catch((err) => {
      next(err);
    });
};
