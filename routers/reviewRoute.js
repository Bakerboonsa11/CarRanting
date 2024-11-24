const express=require("express")
const reviewController=require('./../controllers/reviewCOntroller')
const authController=require('./../controllers/authController')
const Router=express.Router({mergeParams:true})

Router.route('/')
.post(authController.protect,authController.strictTo("user"),reviewController.createReviewForCar)
.get(reviewController.getAllReview)


Router.route('/:id')
.delete(reviewController.deleteReview)
module.exports=Router