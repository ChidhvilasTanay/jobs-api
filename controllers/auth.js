const {BadRequestError, UnauthenticatedError} = require('../errors')
const User = require('../models/User')
require('express-async-errors')
const {StatusCodes} = require('http-status-codes')


const register = async(req, res) => {
     const user = await User.create({...req.body})
     const token = user.createJWT() // sending token // JWT help in selectively sending info to its respective users.
     res.status(StatusCodes.CREATED).json({user:{name:user.name} ,token})
}

const login = async(req, res)=>{
    const {email, password} = req.body
    if(!email || !password){
        throw new BadRequestError('please provide email/ password!')
    }

    const user = await User.findOne({email})

    // throw error if there exists no user with the requested email.
    if(!user){
        throw new UnauthenticatedError('user not found!')
    }
    
    const isPassCorrect = await user.comparePasswords(password)


    // throw error if the password is incorrect.
    if(!isPassCorrect){
        throw new UnauthenticatedError('Invalid password')
    }
    const token = user.createJWT() // sending token after checking the username and password, to check the token in the future.
    res.status(StatusCodes.OK).json({user:{name:user.name}, token})

}

module.exports = {register, login}