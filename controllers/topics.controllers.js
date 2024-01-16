const fs = require("fs/promises");
const { fetchTopics } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topic) => {
      res.status(200).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEndpoints = (req, res, next) => {
  fs.readFile(`./endpoints.json`, "utf8")
    .then((data) => {
      const parsedData = JSON.parse(data);
      res.status(200).send({ endpoints: parsedData });
    })
    .catch((err) => {
      next(err);
    });
};
