const db = require("../db/connection");

exports.fetchAllUsers = () => {
  return db.query(`SELECT * FROM users`).then((res) => {
    if (res.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    } else {
      return res.rows;
    }
  });
};
