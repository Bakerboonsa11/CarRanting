const mongoose =require("mongoose");


const bookingSchema=new mongoose.Schema({
  user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:[true,'echa booking must belongs to user '],

  },
   car:{
    type:mongoose.Schema.ObjectId,
    ref:"Car",
    required:[true,'echa booking must belongs to car '],

  }
  ,paidPrice:{
    type:Number,
    required:[true,'each booking must have price']
  },

  isPaid:{
    type:Boolean,
    default:true
  }
  , 
  createdAt:{
    type :Date,
    default:Date.now()
  }
})

const Booking=mongoose.model("Booking",bookingSchema);


bookingSchema.pre(/^find/,function(next){
    this.populate('user').populate('car')
})

module.exports=Booking