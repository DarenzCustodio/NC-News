const { fetchAllUsers } = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  fetchAllUsers()
    .then((userData) => {
      res.status(200).send({ users: userData });
    })
    .catch((err) => {
      next(err);
    });
};
