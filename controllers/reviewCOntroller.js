const AppError = require('../utils/AppError')
const factoryfn=require('./../controllers/factoryFnc')
const Review=require('./../models/reviewModel')
const catchAsync=require('./../utils/asyncError')


exports.getReview=factoryfn.getOne(Review)
exports.deleteReview=factoryfn.deleteOne(Review)
exports.updateReview=factoryfn.updateOne(Review)
exports.getAllReview=factoryfn.getAll(Review)


exports.createReviewForCar=catchAsync(async(req,res,next)=>{
    // fisrt get user that create review and car that review is given to also
    console.log('entered create')
    console.log(req.params)
    if(!req.body.user){
      req.body.user=req.user.id
    }
    if(!req.body.car){
        req.body.car=req.params.carId
    }
    console.log(req.body);
   const review=await Review.create(req.body)
   console.log(review)
   if(!review) {
    return next(new AppError("review is not created do to some issue",400))
   }

   res.status(200).json({
     status:"success",
     data:{
        review:review
     }
   })
    //  then create review with those info 
    
})
