const db = require("../db/connection.js");

exports.fetchTopics = () => {
    let query = `SELECT * FROM topics`
    return db.query(query).then((res)=>{
        return res.rows;
    })
}
