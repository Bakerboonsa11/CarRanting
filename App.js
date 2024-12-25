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
const carModel=require('./models/carModel')
const App =express()
// morgan midlware used to log request info







// Allow all origins (not recommended for production)
App.use(
  cors({
    origin: "https://carrantingf.onrender.com", // Your frontend URL
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Add methods that you want to allow
    allowedHeaders: ['Content-Type', 'Authorization'], // Add headers you need to allow
  })
);



App.use(morgan("dev"))
App.use(express.static(`${__dirname}/public`));
App.use(express.json());
App.use(cookieParser());


App.use(express.urlencoded({ extended: true }));

// App.use("/",viewRoute)

App.post('/all',async(req,res,next)=>{
     try {
  

    // Get data from the request body
    const data = req.body; // Ensure this is an array of objects to insert

   

    // Insert multiple documents into the database
    const result = await carModel.insertMany(data);
    console.log(result)
    // Send success response
    res.status(201).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    // Handle errors (e.g., validation, duplicate keys)
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
})
App.use("/api/v1/car",CarRoute)
App.use("/api/v1/user",UseRoute)
App.use("/api/v1/bookings",bookingRoute)






App.all("*",(req,res,next)=>{
    const error=new AppError(` The Page (${req.originalUrl.toLowerCase()})this route is not found`,404)
  
   next(error)
})


App.use(errorController);

module.exports=App




