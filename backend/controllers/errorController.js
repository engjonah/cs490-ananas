let Error = require("../models/Error.model");

const insertError = async (req, res) => {
  try {
    const { uid, error } = req.body;
    const newError = new Error({
      uid,
      error,
    });
    await newError.save();
    res.status(201).json({ Message: "Error saved!" });
  } catch (error) {
    console.log(`error occured : ${error.message}`);
  }
};

module.exports = {
  insertError,
};
