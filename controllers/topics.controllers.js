const {fetchTopics} = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
    
    fetchTopics().then((topic)=>{
        
        res.status(200).send({topic})
    }).catch((err)=>{
        next(err);
    })
}