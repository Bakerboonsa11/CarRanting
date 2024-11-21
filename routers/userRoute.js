const express=require('express');

const Router=express.Router()


Router.route('/')
.get((req,res)=>{
     console.log('u entered user router')
})

module.exports=Router