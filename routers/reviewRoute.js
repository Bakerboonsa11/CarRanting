const express=require("express")
const reviewController=require('./../controllers/reviewCOntroller')
const authController=require('./../controllers/authController')
const Router=express.Router({mergeParams:true})
Router.use(authController.protect)
Router.route('/')
.post(authController.strictTo("user"),authController.strictTo("user"),reviewController.createReviewForCar)
.get(reviewController.getAllReview)


Router.route('/:id')
.delete(authController.strictTo("admin","user"),reviewController.deleteReview)
.patch(authController.strictTo("admin","user"),reviewController.updateReview)
.get(authController.strictTo("admin","user"),reviewController.getReview)
module.exports=Router


// 