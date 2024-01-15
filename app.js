const express = require("express");
const app = express();
app.use(express.json());

const {getTopics} = require("./controllers/topics.controllers");

app.get("/api/topics", getTopics);


app.use((err, req, res, next)=>{
    if(err.msg && err.status){
        res.status(err.status).send({msg: err.msg})
    }
})


module.exports = app;