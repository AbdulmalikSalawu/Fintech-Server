const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000
const dotenv = require('dotenv');
const cors = require("cors");
const mongoose = require("mongoose");
dotenv.config()
app.use(cors())

const {register,test} = require('./controllers/usersController');

app.listen(PORT, ()=>{
    console.log("Server has started");
})

app.get('/',(req,res)=>{
    res.render("code is working!!")
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

app.get("/testApi", test)
app.post("/signup", register)