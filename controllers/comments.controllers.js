const { deleteGivenComment } = require("../models/comments.models");

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  deleteGivenComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
