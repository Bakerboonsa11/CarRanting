const express=require('express');
// const { route } = require('../App');


const Router=express.Router();


Router.route('/')
.get((req,res)=>{
    res.status(200).json({
       message:"the car route home"
    })
})


module.exports=Router