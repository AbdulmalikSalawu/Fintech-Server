const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken")
const JWT_SECRET = "skdjsidj9393202e2ejwoksls93e209203920siiiored"
const bcrypt = require("bcrypt")

const test = (req,res)=>{
    res.send("hello world")
}

const register = async (req, response) => {
    const {firstname,lastname,email,password}= req.body
    try{
        const submitData = await userModel.findOne({email})
        if(submitData){
            console.log("user already exists")
            response.send({message:"user already exists"})
        }else{
                try{
                    const done = await userModel.create({firstname,lastname,email,password})
                        if(done){
                            response.send({message:"signup successful",status:true})
                        } else {
                            console.log(err)
                            // response.send({message:"an error occured"})
                            }
                }catch(error){
                    console.log(error)
                    console.log("data could not be saved")
                    response.send({message:"an error occured",status:false})
                }
            }
        }
    catch(error){
        console.log(error)
    }}

    const loginUser = async (req,res)=>{
        const {email,password} = req.body
        const user = await userModel.findOne({email})
        if(!user){
            console.log("user not found")
            return res.json({error:"user not found oo"})
        }
        if(await bcrypt.compare(password,user.password)){
            const token = jwt.sign({email:user.email}, JWT_SECRET);
            if(res.status(201)) {
                return res.json({status: "ok", data: token});
            } else {
                return res.json({error: "error"})
            }
        }
        else res.json({status: "error",error: "invalid password"})
    }


module.exports = {register,test,loginUser}