const express=require("express")
const reviewController=require('./../controllers/reviewCOntroller')
const Router=express.Router()

Router.route('/')
.get(reviewController.getAllReview)


module.exports=Router