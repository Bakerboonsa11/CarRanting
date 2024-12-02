const express=require('express');
const path=require("path")
const AppError=require('./utils/AppError')
const CarRoute=require('./routers/carRoute')
const morgan = require('morgan');
const errorController=require("./controllers/errorController")
const UseRoute=require('./routers/userRoute')
const viewRoute=require('./routers/viewRoute')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const App =express()
// morgan midlware used to log request info


App.use(cookieParser());




// Allow all origins (not recommended for production)
App.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend origin
    credentials: true, // Allow cookies to be sent
  })
);

App.use(morgan("dev"))
App.use(express.static(`${__dirname}/public`));
App.use(express.json());

App.set("view engine", "pug");

// Set the directory for Pug templates
App.set("views", path.join(__dirname, "views"))
// Middleware to parse URL-encoded form data (optional, if needed)
App.use(express.urlencoded({ extended: true }));
App.use("/",viewRoute)
App.use("/api/v1/car",CarRoute)
App.use("/api/v1/user",UseRoute)






App.all("*",(req,res,next)=>{
    const error=new AppError(` The Page (${req.originalUrl.toLowerCase()})this route is not found`,404)
  
   next(error)
})


App.use(errorController);

module.exports=App




