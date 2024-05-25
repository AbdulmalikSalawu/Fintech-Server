const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
let userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    phoneNumber: {type:String, required:true},
    email: {type:String, unique:true},
    password: String,
    newImage: String,
})

const saltRound = 10
userSchema.pre("save",function(next){
    bcrypt.hash(this.password,saltRound,(err,hashedPassword)=>{
        if(err){
            console.log(err)
        }else {
            this.password = hashedPassword
            next()
        }
    })
})
let userModel = mongoose.model("bankUsers",userSchema)

module.exports = userModel