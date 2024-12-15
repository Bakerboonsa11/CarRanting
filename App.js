const express=require('express');
const path=require("path")
const AppError=require('./utils/AppError')
const CarRoute=require('./routers/carRoute')
const morgan = require('morgan');
const errorController=require("./controllers/errorController")
const UseRoute=require('./routers/userRoute')
const viewRoute=require('./routers/viewRoute')
const bookingRoute=require("./routers/bookingRoute")
const cors = require('cors');
const cookieParser = require('cookie-parser');
const App =express()
// morgan midlware used to log request info







// Allow all origins (not recommended for production)
App.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // Allow cookies to be sent
  })
);


App.use(morgan("dev"))
App.use(express.static(`${__dirname}/public`));
App.use(express.json());
App.use(cookieParser());


App.use(express.urlencoded({ extended: true }));

App.use("/",viewRoute)
App.use("/api/v1/car",CarRoute)
App.use("/api/v1/user",UseRoute)
App.use("/api/v1/bookings",bookingRoute)






App.all("*",(req,res,next)=>{
    const error=new AppError(` The Page (${req.originalUrl.toLowerCase()})this route is not found`,404)
  
   next(error)
})


App.use(errorController);

module.exports=App




