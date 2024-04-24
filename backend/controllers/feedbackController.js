let Feedback = require('../models/Feedback.model');

const insertFeedback = async (req, res) => {
  try {
    const { uid, inputLang, outputLang, translationId, rating, review } =
      req.body;
    const newFeedback = new Feedback({
      uid,
      inputLang,
      outputLang,
      translationId,
      rating,
      review,
    });
    await newFeedback.save();
    res.status(201).json({ Message: 'Feedback saved!' });
  } catch (error) {
    console.log(`error occured : ${error.message}`);
  }
};

const getFeedbackCountByRating = async (req, res) => {
  try {
    var ratingCounts = [];
    var temp;
    for (var i = 1; i <= 5; i++) {
      ratingCounts.push(await Feedback.countDocuments({ rating: i }));
    }
    const averageRating = parseFloat(
      (
        (1 * ratingCounts[0] +
          2 * ratingCounts[1] +
          3 * ratingCounts[2] +
          4 * ratingCounts[3] +
          5 * ratingCounts[4]) /
        (await Feedback.countDocuments())
      ).toFixed(2)
    );
    res
      .status(200)
      .json({ RatingCounts: ratingCounts, AverageRating: averageRating });
  } catch (error) {
    console.log(`Error occurred: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const getFeedback = async (req, res) => {
  try {
    // Get all feedback documents
    const allFeedback = await Feedback.find(
      {},
      { review: 1, rating: 1, inputLang: 1, outputLang: 1 }
    );

    // Set to store unique combinations
    const uniqueCombinations = new Set();

    // Filter out duplicates and store unique combinations
    allFeedback.forEach((feedback) => {
      const { review, rating, inputLang, outputLang } = feedback;
      if (review != '') {
        const combination = `${review}-${rating}-${inputLang}-${outputLang}`;
        uniqueCombinations.add(combination);
      }
    });

    // Convert set back to array of unique combinations
    const uniqueFeedback = Array.from(uniqueCombinations).map((combination) => {
      const [review, rating, inputLang, outputLang] = combination.split('-');
      return { review, rating, inputLang, outputLang };
    });

    res.status(200).json({ AllFeedback: uniqueFeedback });
  } catch (error) {
    console.log(`Error occurred: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  insertFeedback,
  getFeedbackCountByRating,
  getFeedback,
};
