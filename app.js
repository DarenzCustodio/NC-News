const express = require("express");
const app = express();

const { getTopics, getEndpoints } = require("./controllers/topics.controllers");

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.use((err, req, res, next)=>{
    if(err.msg && err.status){
        res.status(err.status).send({msg: err.msg})
    }
})

module.exports = app;