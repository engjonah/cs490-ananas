const jwt = require("jsonwebtoken")
const User = require("../models/User.model")
const requireAuth = async (req, res, next) =>{

    const {authorization} = req.headers

    if (!authorization){
        return res.status(401).json({error:'Auth token required'})
    }
    const token = authorization.split(" ")[1]
    try{
        const {uid} = jwt.verify(token, process.env.JWT_TOKEN_KEY)
        req.user = await User.find({uid}).select('uid')
        next()
    }catch(error){
        console.log(error)
        res.status(401).json({error:'Request is not authorized'})
    }

}

module.exports = requireAuth