const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000
const dotenv = require('dotenv');
const cors = require("cors");
const bodyparser = require("body-parser")
const mongoose = require("mongoose");
dotenv.config()
app.use(cors())
app.use(bodyparser.json({limit:"100mb"}))
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
// const authenticateJWT = (req, res, next) => {
//     const token = req.header('x-auth-token');
  
//     if (!token) {
//       return res.status(401).json({ message: 'Authentication failed: No token provided.' });
//     }
  
//     jwt.verify(token,JWT_SECRET, (err, decoded) => {
//       if (err) {
//         return res.status(403).json({ message: 'Authentication failed: Invalid token.' });
//       }
//       req.user = decoded;
//       next();
//     });
//   };
app.post("/signup", (register))
app.get("/testApi", test)
app.post("/login", loginUser)
app.post("/userData", userData)