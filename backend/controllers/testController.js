let Test = require('../models/test.model');

const getTest = (req, res) => {
  let query = { ...req.body };

  Test.find(query)
    .then((test) => res.json(test))
    .catch((err) => res.status(400).json('Error: ' + err));
};

module.exports = {
  getTest,
};
