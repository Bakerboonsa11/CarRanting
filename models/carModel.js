const mongoose=require("mongoose");

const carSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true,
  }
    ,
  make:{
    type:String,
    required:true
  },
  year:{
    type:Number,
    required:true
  }
  ,
  pricePerDay:{
    type:Number,
    required:true
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

const Car =mongoose.model("Car",carSchema)

module.exports=Car