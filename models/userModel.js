const mongoose=require('mongoose');
const { validate } = require('./carModel');
const validator=require('validator')
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

    },
    confirmPassword:{
        type:String,
        required:[true,'please confirm the password'],
        validate:{
            validator:(confirmPassword)=>{
               return confirmPassword===this.password
            },
            message:"confirm password must match the password"
        }
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