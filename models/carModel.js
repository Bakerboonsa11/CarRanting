const mongoose=require("mongoose");
const slugify=require('slugify')
const validator = require('validator');

const carSchema=new mongoose.Schema({
name: {
  type: String, // Fix type to String
  required: [true, "Name is required"],
  maxlength: [30, "Maximum name length is 30"], // Corrected to match the defined maximum
  minlength: [3, "Minimum name length is 3"],
  validate: {
    validator: function (val) {
      return validator.isAlpha(val, 'en-US', { ignore: ' ' }); // Allow letters and spaces
    },
    message: 'Name must only contain letters', // Error message
  },
  unique: true,
  trim: true,
}
,
 
    
  make:{
    type:String,
    required:[,'maker is required']
  },
  year:{
    type:Number,
    required:true
  }
  ,
  pricePerDay:{
    type:Number,
    required:true
  },
  RatingQuantity:{
    type:Number,
    required:true
  },
  RatingAvrg:{
    type:Number,
    min:[1.0,"minimum is 1"],
    max:[5.0,"maximum is 5"],
    default:4.5,
    set:val=>Math.round(val*10)/10
  }
  ,
  mileage:{
    type:Number,
    required:true
  },
   fuelType:{
    type:String,
    enum: ['Gas', 'Diesel', 'Electric', 'Hybrid'],
    required:true
  },
   transmission: { type: String, enum: ['Automatic', 'Manual'], required: true }, // Transmission type
   color: { type: String, required: true }, // Color of the car
   description: { type: String, required: true }, // A short description about the car
   images: [{ type: String }],
   location: { 
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true } // [longitude, latitude] for geospatial queries
  },
  createdAt: { type: Date, default: Date.now }, // Date the car was added
  updatedAt: { type: Date, default: Date.now }, // Date when the car details were last updated
})
carSchema.pre("save",(next)=>{
  if(!this.slug){
    // create slugify
    this.slug=slugify(`${this.name}`,{lower:true})
  }
  next()
})

carSchema.pre(/^find/,function(next){
  this.startQueryDate=Date.now()
  next()
})

carSchema.post(/^find/,function(docs,next){
      console.log(`the time it takes is ${ this.TimeItTake=Date.now()-this.startQueryDate} milisecond`)
      next()
})
const Car =mongoose.model("Car",carSchema)

module.exports=Car