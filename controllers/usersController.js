const express = require("express");
const app = express();
const userModel = require("../models/user.model");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken")
const JWT_SECRET = "skdjsidj9393202e2ejwoksls93e209203920siiiored"
const nodemailer = require('nodemailer');
const stripe = require("stripe")(process.env.STRIPE_KEY)
require("dotenv").config()
// const stripe = Stripe(process.env.STRIPE_KEY)
const bcrypt = require("bcrypt")
const dotenv = require('dotenv');
dotenv.config()

    cloudinary.config({
        cloud_name: "drxn6gv3x",
        api_key: "456564468421393",
        api_secret: "R4xUn1CG2PpBFSlDzyrdsD4dbyw"
    });

    const test = (req,res)=>{
        res.send("hello world")
    }


    //REGISTERING NEW USERS ... REGISTERING NEW USERS
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

    //LOGGING USERS IN ... LOGGING USERS IN 
    const loginUser = async (req,res)=>{
        const {email,password} = req.body
        const user = await userModel.findOne({email})
        if(!user){
            console.log("user not found")
            return res.json({error:"user not found oooo"})
        }
        if(await bcrypt.compare(password,user.password)){
            const token = jwt.sign({email:user.email}, JWT_SECRET, {
                expiresIn:1200,
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

    //GETTING UNIQUE USER DATA ... GETTING UNIQUE USER DATA
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
                return res.json({status: "error", data: "token expired oo"})
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

        //GETTING ALL USER DETAILS ... GETTING ALL USER DETAILS
        const getAllUsers = async (req,res) => {
            let query = {}
            const searchData = req.query.search;
            if (searchData!==""){
            query={
                $or:[
                    {firstname:{$regex:searchData,$options:"i"}},
                    {email:{$regex:searchData,$options:"i"}},
                ]
            }
            try {
                const myCustomers = await userModel.find(query)
                res.send({status: "ok", data:myCustomers})
            } catch (error) {
                console.log(error)
            }
            }
            else if (searchData == "") {
                try {
                    const myCustomers = await userModel.find()
                    res.send({status: "ok", data:myCustomers})
                } catch (error) {
                    console.log(error)
                }
            }
        }

        //SAVING IMAGES AND FILES
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

        //FORGOT PASSWORD FUNCTIONALITY
        const forgotpassword = async (req,res)=>{
            const {email} = req.body;
            try {
                const oldUser = await userModel.findOne({ email })
                if(!oldUser){
                    return res.json({status:"user doesn't exist"})
                }
                const secret = JWT_SECRET + oldUser.password;
                const token = jwt.sign({ email: oldUser.email, id: oldUser.id}, secret, {expiresIn:"15m"})

                //GIVING USERS THE RESET PASSWORD LINK
                const link = `http://abdulmalikyinka.onrender.com/reset-password/${oldUser._id}/${token}`;
                // const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;

                //SENDING RESET PASSWORD LINK TO USERS' EMAIL
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: "salawuabdulmalik100@gmail.com",
                      pass: "vxphzqeazaralhoi"
                    }
                  });
                  
                  var mailOptions = {
                    from: "salawuabdulmalik100@gmail.com",
                    to: email,
                    subject: 'Sending Email using Node.js',
                    text: link
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });

                return res.json({link:"Check your email for a link to reset your password"})
            } 
            catch (error){
                console.log(error)
            }
        }    

        //RESETTING USERS' PASSWORD ... RESETTING USERS' PASSWORD
        const resetpassword = async (req,res)=>{
            const {id, token} = req.params;
            const oldUser = await userModel.findOne({_id: id})
            if(!oldUser){
                return res.json({status:"user doesn't exist"})
            }
            const secret = JWT_SECRET + oldUser.password;
            try {
                const verify = jwt.verify(token, secret);
                // res.render("newpassword", {email:verify.email, status:"not verified"})
                res.render("updatepassword", {email:verify.email, status:"not verified"})
            } catch (error) {
                console.log(error)
                res.send("oops! your token has expired. Login again via this link")
            }
        }
        
        //CHANGING USERS' PASSWORD ... CHANGING USERS PASSWORD
        const changepassword = async (req,res)=>{
            const { id, token} = req.params;
            const {password} = req.body 
            const oldUser = await userModel.findOne({_id: id})
            if(!oldUser){
                return res.json({status:"user doesn't exist"})
            }
            const secret = JWT_SECRET + oldUser.password;
            try {
                const verify = jwt.verify(token, secret);
                const encryptedPassword = await bcrypt.hash(password, 10);
                await userModel.updateOne(
                    {
                        _id: id,
                    },
                    {
                        $set: {
                            password: encryptedPassword
                        }
                    }
                );
                res.render("updatepassword", {email:verify.email,status:"verified"})
            } catch (error) {
                console.log(error)
                res.json({status: "something went wrong"})
            }
        }

        //UPDATING USER DETAILS ... UPDATING USER DETAILS
        const updateDetails = async (req,res)=>{
            const {id,nameone,nametwo} = req.body
            try {
                await userModel.updateOne(
                    {
                        _id: id,
                    },
                    {
                        $set: {
                            firstname: nameone,
                            lastname: nametwo
                        }
                    }
                );
                return res.json({status:firstname, data:"updated"})
            } catch (error) {
                console.log(error)
                res.json({status: "something went wrong"})
            }
        }

        //DELETING USERS ... DELETING USERS
        const deleteUser = async (req,res)=>{
            const {uniqueid} = req.body
            try {
                await userModel.deleteOne({_id:uniqueid})
                res.send({status: "ok",data: "deleted"})
            } catch (error) {
                console.log(error)
            }
        }

        //STRIPE CHECKOUT PAYMENT INTEGRATION
        const createCheckoutSession = async (req,res)=>{
            const line_items = req.body.itemInCart.map((item)=> {
                return{
                    price_data: {
                        currency: 'ngn',
                        product_data: {
                          name: item.itemName,
                          images: [item.itemURL],
                        },
                        unit_amount: item.itemPrice * 100,
                      },
                      quantity: item.cartQuantity,
                }
            })
            try {const session = await stripe.checkout.sessions.create({
                line_items,
                mode: 'payment',
                success_url: `${process.env.CLIENT_URL}/paysuccess`,
                cancel_url: `${process.env.CLIENT_URL}/carts`,
              });
            //   res.json({id:session.id})}
              res.send({url: session.url})}
              catch (error) {
                console.log(error)
              };
        }


module.exports = {register,test,loginUser,userData,getAllUsers,saveFile,forgotpassword,resetpassword,changepassword,updateDetails,deleteUser,createCheckoutSession}