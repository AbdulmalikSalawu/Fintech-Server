const userModel = require("../models/user.model");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken")
const JWT_SECRET = "skdjsidj9393202e2ejwoksls93e209203920siiiored"
const bcrypt = require("bcrypt")

cloudinary.config({
    cloud_name: "drxn6gv3x",
    api_key: "456564468421393",
    api_secret: "R4xUn1CG2PpBFSlDzyrdsD4dbyw"
  });

const test = (req,res)=>{
    res.send("hello world")
}

const register = async (req, response) => {
    const {firstname,lastname,phoneNumber,email,password,newImage}= req.body
    try{
        const submitData = await userModel.findOne({email})
        if(submitData){
            console.log("user don dey")
            response.send({message:"user already exists"})
        }else{
                try{
                    const done = await userModel.create({firstname,lastname,phoneNumber,email,password,newImage})
                        if(done){
                            response.send({message:"Signup successful",status:true})
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

    // const loginUser = async (req,res)=>{
    //     const {email,password} = req.body
    //     const user = await userModel.findOne({email})
    //     if(!user){
    //         console.log("user not found")
    //         return res.json({error:"user not found oooo"})
    //     }
    //     if(await bcrypt.compare(password,user.password)){
    //         const token = jwt.sign({email:user.email}, JWT_SECRET);
    //         if(res.status(201)) {
    //             return res.json({status: "ok", data: token});
    //         } else {
    //             return res.json({error: "error"})
    //         }
    //     }
    //     else res.json({status: "error",error: "invalid password"})
    //     console.log("invalid password")
    // }

    const loginUser = async (req,res)=>{
        const {email,password} = req.body
        const user = await userModel.findOne({email})
        if(!user){
            console.log("user not found")
            return res.json({error:"user not found oooo"})
        }
        if(await bcrypt.compare(password,user.password)){
            const token = jwt.sign({email:user.email}, JWT_SECRET, {
                expiresIn:10,
            });
            if(res.status(201)) {
                return res.json({status: "ok", data: token});
            } else {
                return res.json({error: "error"})
            }
        }
        else res.json({status: "error",error: "invalid password"})
        console.log("invalid password")
    }

    const userData = async (req,res)=>{
        const { token } = req.body;
        try {
            const uniqueUser = jwt.verify(token, JWT_SECRET,(err,res) => {
                if(err){
                    return "token expired";
                }
                return res;
            });
            if(uniqueUser=="token expired"){
                return res.send({status: "error", data: "token expired"})
            }

            const useremail = uniqueUser.email;
            await userModel.findOne({email:useremail})
            .then((data)=>{
                return res.json({status:"ok",data:data})
            })
            .catch((error)=>{
                console.log(error)
                return res.json({status:"error",data:error})
            });}
            catch(error){
                console.log(error)
            }
        }

        const saveFile = (req,res)=>{
            const myFile = req.body.file
            const resp = cloudinary.uploader.upload(myFile, {public_id: "olympic_flag"})
            resp.then((data) => {
                console.log(data);
                console.log(data.secure_url);
                const myImage = data.secure_url
                res.send({message:"image upload successful",image:myImage})
            })
            .catch((err) => {
                res.send({message:"upload failed"})
                console.log(err);
            });
        }

module.exports = {register,test,loginUser,userData,saveFile}