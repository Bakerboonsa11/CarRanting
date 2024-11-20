const express=require('express');
const CarRoute=require('./routers/carRoute')
const morgan = require('morgan');

const App =express()
// morgan midlware used to log request info
App.use(morgan("dev"))
App.use(express.json());

// Middleware to parse URL-encoded form data (optional, if needed)
App.use(express.urlencoded({ extended: true }));

App.use("/api/v1/car",CarRoute)

App.use("/",(req,res)=>{
  res.status(200).json({
    meassage:"app is avaliable"
  })
})




App.use((error,req,res,next)=>{
  console.log("its also entered app error")
  const {message,statusCode,status,} ={...error}
  console.log(message,statusCode,status)
 console.log(error)
  res.status(statusCode).json({
    status:status,
    error:error.message
  })
})

module.exports=App




