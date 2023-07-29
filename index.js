const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000
const dotenv = require('dotenv');
const cors = require("cors");
const bodyparser = require("body-parser")
const mongoose = require("mongoose");
dotenv.config()
app.use(cors())
app.use(bodyparser.json({limit:"50mb"}))
app.use(bodyparser.urlencoded({extended:true,limit:"50mb"}));

const {register,test,loginUser,userData} = require('./controllers/usersController');

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
app.post("/signup", (register))
app.get("/testApi", test)
app.post("/login", loginUser)
app.post("/userData", userData)