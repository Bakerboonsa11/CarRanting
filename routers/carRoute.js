const express=require('express');
const carController=require('./../controllers/carController')
// const { route } = require('../App');


const Router=express.Router();


Router.route('/')
// .get(carController.createCar)
.post(carController.createCar)
Router.route("/:id")
.patch(carController.updateCar)
.delete(carController.deleteCar)

module.exports=Router