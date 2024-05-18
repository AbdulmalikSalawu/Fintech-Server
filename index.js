const express = require("express");
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000
const userModel = require("./models/user.model");
const dotenv = require('dotenv');
const cors = require("cors");
const bodyparser = require("body-parser")
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken")
const JWT_SECRET = "skdjsidj9393202e2ejwoksls93e209203920siiiored"
dotenv.config()
app.use(cors({
    // origin: 'http://localhost:3000 https://yinka-meals.netlify.app',
    origin: function(origin, callback){
        if(!origin) return callback(null, true);
        const allowedOrigins = ['http://localhost:3000', 'https://yinka-meals.netlify.app', 'https://savewithmalik.netlify.app/resetpassword', 'https://abdulmalikyinka.onrender.com'];
        if(allowedOrigins.includes(origin)){
          callback(null,true)
        }else{
          callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
}))
app.options('*', cors());
app.use(bodyparser.json({limit:"100mb"}))
app.use(bodyparser.urlencoded({extended:true,limit:"50mb"}));

// app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs")
app.set('views', path.resolve("./views"));
app.use(express.urlencoded({extended: false}))

const {register,test,loginUser,userData,getAllUsers,saveFile,forgotpassword,resetpassword,changepassword,updateDetails,deleteUser,createCheckoutSession} = require('./controllers/usersController');

app.use(express.static("public"))

app.listen(PORT, ()=>{
    console.log("Server has started");
})

app.get('/',(req,res)=>{
    res.send("code is working!!")
})

mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Fintech'
})
    .then((res)=>{
        console.log("connection successful")
    }).catch((err)=>{
        console.log(err)	
})
app.get("/testing", (req,res)=>{res.send("working")})
app.post("/signup", (register))
app.get("/testApi", test)
app.post("/login", loginUser)
app.post("/userData", userData)
app.get("/allUsers", getAllUsers)
app.post("/saveFile", saveFile)
app.post("/forgot-password", forgotpassword)
app.get("/reset-password/:id/:token", resetpassword)
app.post("/reset-password/:id/:token", changepassword)
app.post("/updatedetails", updateDetails)
app.post("/deleteUser", deleteUser)
app.post("/createCheckoutSession", createCheckoutSession)