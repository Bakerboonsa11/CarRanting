const express=require('express');
const carController=require('./../controllers/carController')

const Router=express.Router();

// GENERAL CAR ROUTES
Router.route('/')
.get(carController.getAllCar)
.post(carController.createCar)
Router.route("/:id")
.get(carController.getOneCar)
.patch(carController.updateCar)
.delete(carController.deleteCar)

module.exports=Router