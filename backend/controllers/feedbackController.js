let Feedback = require('../models/Feedback.model');

const insertFeedback = async(req,res) =>{
    try {
        const {uid,inputLang,outputLang,translationid, rating, review} = req.body;
        const newFeedback = new Feedback({
            uid,
            inputLang,
            outputLang,
            translationid,
            rating,
            review,
        })
        await newFeedback.save();
        res.status(201).json({Message: "Feedback saved!"})
    }
    catch (error){
        console.log(`error occured : ${error.message}`)
    }
};


module.exports = {
  insertFeedback,
}