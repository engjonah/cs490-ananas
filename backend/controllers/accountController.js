let User = require('../models/User.model');

//Get User by uid
const getUser = async (req, res) => {
    const {uid} = req.body;
    const user = await User.find({uid});
    if (!user){
        return res.status(404).json({error:"User not found! Please sign up!"});
    } else {
        return user;
    }

}

module.exports = {
    getUser
}