const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = mongoose.Schema({
name:{
    type:String,
    required:[true, 'please provide name!'],
    minlength:3,
    maxlength:50
},
email:{
    type:String,
    required:[true, 'please provide email!'],
    match : [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'please provide valid email'],
    unique:true
},
password:{
    type:String,
    required:[true, 'please provide name!'],
    minlength:6,
}
})

userSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// instance methods
userSchema.methods.createJWT = function (){
    return jwt.sign({userId: this._id, name:this.name}, process.env.JWT,{expiresIn:process.env.JWT_TIME})
}

userSchema.methods.comparePasswords = async function(reqPassword){
    const isMatch = await bcrypt.compare(reqPassword, this.password)
    return isMatch
}


module.exports = mongoose.model('User', userSchema)