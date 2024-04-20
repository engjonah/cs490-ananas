let Feedback = require('../models/Feedback.model');

const insertFeedback = async(req,res) =>{
    try {
        const { uid, inputLang, outputLang, translationId, rating, review } = req.body;
        const newFeedback = new Feedback({
            uid,
            inputLang,
            outputLang,
            translationId,
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

const getFeedbackCountByRating = async(req,res) => {
    try {
        var ratingCounts = [] 
        var temp;
        for (var i = 1; i <= 5; i++) {
            ratingCounts.push(await Feedback.countDocuments({rating : i}))
        }
        const averageRating =  parseFloat(( ( 1*ratingCounts[0] + 2*ratingCounts[1] + 3*ratingCounts[2] + 4*ratingCounts[3] + 5*ratingCounts[4] ) / await Feedback.countDocuments() ).toFixed(2))
        res.status(200).json({ RatingCounts : ratingCounts, AverageRating : averageRating })
    } catch (error) {
        console.log(`Error occurred: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
}

const getFeedback = async (req, res) => {
    try {
        // Aggregate to group by review and select one document per group
        const uniqueFeedback = await Feedback.aggregate([
            // Group by review field
            { $group: { _id: '$review', doc: { $first: '$$ROOT' } } },
            // Project to include only selected fields
            { $project: { _id: 0, inputLang: '$doc.inputLang', outputLang: '$doc.outputLang', review: '$doc.review', rating: '$doc.rating' } }
        ]);

        res.status(200).json({ AllFeedback: uniqueFeedback });
    } catch (error) {
        console.log(`Error occurred: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
  insertFeedback,
  getFeedbackCountByRating,
  getFeedback
}