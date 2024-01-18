const db = require("../db/connection");

exports.deleteGivenComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING*;`, [
      comment_id,
    ])
    .then((res) => {
      if (res.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};
