const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000
const userModel = require("./models/user.model");
const dotenv = require('dotenv');
const cors = require("cors");
const bodyparser = require("body-parser")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const JWT_SECRET = "skdjsidj9393202e2ejwoksls93e209203920siiiored"
dotenv.config()
app.use(cors())
app.use(bodyparser.json({limit:"100mb"}))
app.use(bodyparser.urlencoded({extended:true,limit:"50mb"}));
app.set("view engine", "ejs")
app.use(express.urlencoded({extended: false}))

const {register,test,loginUser,userData, saveFile,forgotpassword,resetpassword,changepassword} = require('./controllers/usersController');

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
app.get("/testing", (req,res)=>{res.send("woring")})
app.post("/signup", (register))
app.get("/testApi", test)
app.post("/login", loginUser)
app.post("/userData", userData)
app.post("/saveFile", saveFile)
app.post("/forgot-password", forgotpassword)
app.get("/reset-password/:id/:token", resetpassword)
app.post("changepassword/:id/:token", changepassword)

app.use(express.static("public"))