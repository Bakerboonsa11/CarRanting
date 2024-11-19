const express=require('express');
const carController=require('./../controllers/carController')

const Router=express.Router();

// STATICS DATA CAR ROUTES
Router.route('/top-3-cheapCar')
.get(carController.getTopCar,carController.getAllCar)
Router.route('/getCarStat')
.get(carController.getCarStat)



// GENERAL CAR ROUTES
Router.route('/')
.get(carController.getAllCar)
.post(carController.createCar)
Router.route("/:id")
.get(carController.getOneCar)
.patch(carController.updateCar)
.delete(carController.deleteCar)

module.exports=Router