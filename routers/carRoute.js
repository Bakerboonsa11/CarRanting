const express=require('express');
const carController=require('./../controllers/carController')
// const { route } = require('../App');


const Router=express.Router();


Router.route('/')
.get(carController.createCar)


module.exports=Router