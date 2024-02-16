let Test = require('../models/test.model');

const getTest = ((req, res) => {

    let query = {...req.body};
    console.log(query);
    //res.json("hello");
    console.log(Test.find(query));
    Test.find(query)
        .then(test => res.json(test))
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = {
    getTest,
}