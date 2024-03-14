const jwt = require("jsonwebtoken");
let User = require('../models/User.model');

const loginUser = async(req,res) =>{
    try {
        const {email,uid,remember} = req.body;
        console.log(email,uid,remember)
        if (email === ''){
            return res.status(400).json({error:"Please fill in all fields!"})
        }else if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) == false ){
            return res.status(400).json({error:"Invalid email!"})
        }else if (uid == ''){
            return res.status(400).json({error:"Something went wrong with third-party sign in"})
        }
        const userFound = await User.findOne({uid});
        if (!userFound){
            return res.status(404).json({error:"User not found! Please sign up!"});
        }else{
            let time = '10m';
            if (remember == true){
                time = '14d';
            }
            const token = jwt.sign({ uid }, process.env.JWT_TOKEN_KEY, {expiresIn: time});
            res.status(201).json({Message: "User logged in!", uid, token})
        }
    }
    catch (error){
        console.log(`error occured : ${error.message}`)
        return res.status(400).json({error:"Something went wrong!"})
    }
};


module.exports = {
  loginUser,
}