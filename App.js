const express=require('express');
const CarRoute=require('./routers/carRoute')
const morgan = require('morgan');
const errorController=require("./controllers/errorController")
const UseRoute=require('./routers/userRoute')
const App =express()
// morgan midlware used to log request info
App.use(morgan("dev"))
App.use(express.json());

// Middleware to parse URL-encoded form data (optional, if needed)
App.use(express.urlencoded({ extended: true }));

App.use("/api/v1/car",CarRoute)
App.use("/api/v1/user",UseRoute)




App.get("/",(req,res)=>{
  res.status(200).json({
    meassage:"app is avaliable"
  })
})

App.all("*",(req,res,next)=>{
   res.status(400).json({
    status:"error",
    data:'error page'
   })
})


App.use(errorController);

module.exports=App




