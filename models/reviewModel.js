const mongoose=require("mongoose");
const User = require("./userModel");
const Car = require("./carModel");
const catchAsync=require("./../utils/asyncError")


const reviewSchema= new mongoose.Schema({
      review:{
        type:String,
        required:[true,"review is required"]
      }
      ,
      rating:{
        type:Number,
        required:[true,"rating is required"],
        max:[5.0,'maximum rating is 5'],
        min:[1.0,'minimum rating is 1 ']
      },
      user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:[true,"user is required"]
      },
      car:{
        type:mongoose.Schema.ObjectId,
        ref:"Car",
        required:[true,'car is required for review']
      },
      createdAt:{
        type:Date,
        default:Date.now()
      }
})


reviewSchema.statics.calculateRatingAvrage = async function (carId) {
  try {
    console.log("entered aggregation");
    const ratingCalculation = await this.aggregate([
      {
        $match: {
          car: carId, // Fixed the field name to `car` (assuming your reviews reference a car with `carId`)
        },
      },
      {
        $group: {
          _id: carId,
          ratingQuantity: { $sum: 1 }, // Count the total number of reviews
          ratingAv: { $avg: "$rating" }, // Calculate the average rating
        },
      },
    ]);

    if (ratingCalculation.length === 0) {
      // No reviews found for the car
      await Car.findByIdAndUpdate(carId, {
        RatingQuantity: 0,
        RatingAvrg: 4.5, // Default average rating
      });
    } else {
      // Update the car with the calculated rating stats
      await Car.findByIdAndUpdate(carId, {
        RatingQuantity: ratingCalculation[0].ratingQuantity,
        RatingAvrg: ratingCalculation[0].ratingAv,
      });
    }
  } catch (err) {
    console.error(err); // Log the error
  }
};


reviewSchema.post('save',function(){
  console.log("pre is wrning")
  this.constructor.calculateRatingAvrage(this.car)
})

reviewSchema.pre(/^findOneAnd/, async function (next) {
  console.log("Entered pre findOneAnd middleware");

  // Find the document being updated/deleted
  this.r = await this.model.findOne(this.getFilter());
  console.log("Document found:", this.r);

  next();
});


reviewSchema.post(/^findOneAnd/,async function(){
  console.log('also ........')
  await this.r.constructor.calculateRatingAvrage(this.r.car)
})
reviewSchema.index({car:1,user:1},{unique:true})
const Review= mongoose.model("Review",reviewSchema)

module.exports=Review