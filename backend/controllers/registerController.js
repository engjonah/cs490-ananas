let User = require('../models/User.model');

const registerNewUser = async(req,res) =>{
    try {
        const {name,email,uid} = req.body;
        console.log(name,email,uid);
        console.log(`register new user received ${name,email,uid}`)
        const userFound = await User.findOne({uid});
        if (name == '' || email === ''){
            throw Error("Please fill in all fields!")
        }else if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) == false ){
            throw Error("Invalid email!")
        }else if (uid == ''){
            throw Error("Something went wrong with third-party sign in")
        }
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