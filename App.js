const express=require('express');
const morgan = require('morgan');

const App =express()
// morgan midlware used to log request info
App.use(morgan("dev"))

App.get('/',(req,res)=>{
  res.status(200).json({
    meassage:"app is avaliable"
  })
})




module.exports=App


