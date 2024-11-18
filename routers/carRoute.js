const express=require('express');
const carController=require('./../controllers/carController')



const Router=express.Router();


Router.route('/')
.get(carController.getAllCar)
.post(carController.createCar)
Router.route("/:id")
.patch(carController.updateCar)
.delete(carController.deleteCar)

module.exports=Router