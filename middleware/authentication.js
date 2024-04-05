const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')
require('dotenv')
require('express-async-errors')


const authentication = async(req, res, next)=>{
const authHeader = req.headers.authorization
if(!authHeader || !authHeader.startsWith('Bearer')){
    throw new UnauthenticatedError('missing token!')
}
const token = authHeader.split(' ')[1]
try{
    const decoded =  jwt.verify(token, process.env.JWT)
    req.user = {userId: decoded.userId, name:decoded.name}
    next()
}
catch(error){
    throw new UnauthenticatedError('incorrect token!')
}
}


module.exports = authentication
