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
    console.log("bbody is",req.body);
  
         const review=await Review.create(req.body)
    if(!review) console.log('reviw is noo')
      console.log("review is ",review)
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
exports.getAllCarReview = catchAsync(async (req, res, next) => {
  // Prevent caching
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Validate `req.user` and `req.params.id`
  const user_id = req.user?._id; // Safe optional chaining
  const car_id = req.params.carId;

  console.log("User ID and Car ID:", user_id, car_id);

  if (!user_id || !car_id) {
    return next(
      new AppError(
        "Please login first or specify a valid car to access reviews.",
        404
      )
    );
  }

  // Fetch reviews for the car
  const reviews = await Review.find({ car: car_id });
 console.log("revis now is ",reviews)
  

  if (reviews.length === 0) {
    return res.status(200).json({
      status: "success",
      message: "There are no reviews for this car.",
      reviews:[]
    });
  }

  // Respond with reviews
  res.status(200).json({
    status: "success",
    reviews,
  });
});

