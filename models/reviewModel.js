const mongoose=require("mongoose");
const User = require("./userModel");


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

const Review= mongoose.model("Review",reviewSchema)