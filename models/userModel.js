const mongoose=require('mongoose');
const { validate } = require('./carModel');
const validator=require('validator');
const AppError = require('../utils/AppError');
const bcrypt=require("bcrypt")
const crypto=require("crypto")
const userSchema= new mongoose.Schema({
     name:{
        type:String,
        required:[true,"name is required"]
     },

    email:{
        type:String,
        required:[true,"email is required please provide the email"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"please enter a correct format"]
    },
    photo:String,

    password:{
        type:String,
        required:[true,'please provide the password'],
        minlength:8,
        select:false
    },
    confirmPassword:{
        type:String,
        required:[true,'please confirm the password'],
       
    },
    roles:{
        type:String,
        enum:['user',"admin"],
        default:"user"
    },

   changedPasswordAt:Date,
   resetPassword:String,
   expireResetPassword:Date,
   isActive:{
    type:Boolean,
    default:true,
    // select:false
   }
})
userSchema.pre("save", async function (next) {
  // Only run this validation if the password is being created or modified
  if (!this.isModified("password") && !this.isNew) {
    return next(); // Skip if not modifying password
  }

  // Check if password and confirmPassword match
  if (this.password !== this.confirmPassword) {
    return next(new AppError("Please provide the same password", 400));
  }
  this.password=await bcrypt.hash(this.password,12)
  console.log(this.password)
  // Ensure confirmPassword is not saved in the database
  this.confirmPassword = undefined;
  next();
});



//SCHEMA METHODS

userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
  return bcrypt.compare(candidatePassword,userPassword)
}
userSchema.methods.ispasswordUpdated=function(iat){

  if(this.changedPasswordAt){
       const newchangedPasswordAt= parseInt(this.changedPasswordAt.getTime()/1000,10)

       return newchangedPasswordAt>iat
  }
  else{
      return false
  }
    
}
userSchema.methods.createResetPassword=function(){
  const random_token=crypto.randomBytes(32).toString("hex")
  this.resetPassword=crypto.createHash("sha256").update(random_token).digest("hex")
  this.expireResetPassword=Date.now()+10*60*1000

  return random_token
}
const User=mongoose.model("User",userSchema)

module.exports=User




// const useroSchema=new mongoose.Schema({
//     name:{
//         type:String,
//         required:[true,'please enter user name']
//     },
//     email:{
//         type:String,
//         required:[true,'please provide an email'],
//         unique:true,
//         lowercase:true,
//         validate:[validator.isEmail,'please enter a correct format']
//     },
//     photo:String,
//     roles:{
//         type:String,
//         enum:['admin','leader','user'],
//         default:'user'
//     },
//     password:{
//         type:String,
//         required:[true,'password is required'],
//         minlength:8,
//         select:false
//     },
//     passwordConfirm:{
//         type:String,
//         required:[true,'confirming password is required'],
//         validate:{
//             validator:function(el){
//                 return el===this.password;
//             },
//             message:'please confirm with the same password'
//         }
//     },
//    changedPasswordAt:Date,
//    resetPassword:String,
//    expireResetPassword:Date,
//    isActive:{
//     type:Boolean,
//     default:true,
//     // select:false
//    }
   
// })
// 