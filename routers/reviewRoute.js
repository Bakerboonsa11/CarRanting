const express=require("express")
const reviewController=require('./../controllers/reviewCOntroller')
const authController=require('./../controllers/authController')
const Router=express.Router({mergeParams:true})

Router.route('/')
.post(authController.protect,reviewController.createReviewForCar)
.get(reviewController.getAllReview)


module.exports=Router