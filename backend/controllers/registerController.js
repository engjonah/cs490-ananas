let User = require('../models/User.model');

const registerNewUser = async(req,res) =>{
    try {
        const {name,email,uid} = req.body;
        console.log(name,email,uid);
        console.log(`register new user received ${name,email,uid}`)
        const userFound = await User.findOne({uid});

        if (userFound){
            return res.status(422).json({error:"User exists!"});
        }else{
            const newUser = new User({
                name,
                email,
                uid,
            });
            await newUser.save();
            res.status(201).json({Message: "User registered!"})
        }
    }
    catch (error){
        console.log(`error occured : ${error.message}`)
    }
};


module.exports = {
  registerNewUser,
}