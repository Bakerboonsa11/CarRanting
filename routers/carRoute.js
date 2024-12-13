const express=require('express');
const carController=require('./../controllers/carController')
 const ReviewRoute= require("./reviewRoute")
 const authController=require("./../controllers/authController")

const Router=express.Router();
Router.use("/:carId/Review", ReviewRoute);

// STATICS DATA CAR ROUTES
Router.route('/top-3-cheapCar')
.get(authController.protect,authController.strictTo("admin"),carController.getTopCar,carController.getAllCar)
Router.route('/getCarStat')
.get(carController.getCarStat)



// GENERAL CAR ROUTES
Router.route('/')
.get(carController.getAllCar)
.post(carController.createCar)
Router.route("/:id")
.get(authController.protect,carController.getOneCar)
.patch(authController.protect,authController.strictTo("Admin"), 
      carController.uploadFiles,carController.processImages,carController.updateCar)
.delete(carController.deleteCar)

module.exports=Router