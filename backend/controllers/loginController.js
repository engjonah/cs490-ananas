const jwt = require("jsonwebtoken");
let User = require('../models/User.model');

const loginUser = async(req,res) =>{
    try {
        const {name,email,uid} = req.body;
        if (name == '' || email === ''){
            throw Error("Please fill in all fields!")
        }else if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) == false ){
            throw Error("Invalid email!")
        }else if (uid == ''){
            throw Error("Something went wrong with third-party sign in")
        }
        const userFound = await User.findOne({uid});
        if (!userFound){
            return res.status(404).json({error:"User not found! Please sign up!"});
        }else{
            const token = jwt.sign({ uid }, process.env.JWT_TOKEN_KEY, {expiresIn: '2h'});
            res.status(201).json({Message: "User logged in!", uid, token})
        }
    }
    catch (error){
        console.log(`error occured : ${error.message}`)
    }
};


module.exports = {
  loginUser,
}