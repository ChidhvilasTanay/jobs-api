const jwt = require('jsonwebtoken')
require('express-async-errors')
require('dotenv')
const {UnauthenticatedError} = require('../errors')


const authentication = async(req, res, next) =>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('no token present')
    }
    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, process.env.WEB_TOKEN)
    const {username} = decoded
    req.user = {username}
}