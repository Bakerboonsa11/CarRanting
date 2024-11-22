const User = require('./../models/userModel')
const AppFeatures=require("./../utils/AppFeatures")
// const AppError=require("./../utils/AppError")
const AppError=require("./../utils/AppError")
const catchAsync=require("./../utils/asyncError")


// exports.getAllUser=(req,res)=>{
// const User=require('./../models/userModel')

// }

exports.createUser= catchAsync(async(req,res)=>{
 const user=await User.create(req.body)
   res.status(200).json({
     status:"success",
     user:{
        user
     }
   })
})
exports.getUsers=catchAsync(async(req,res)=>{
     const users=await User.find()
     if(!users){
       return next(new AppError("there is no any user",404))
     }

   res.status(200).json({
    status:"success",
    data:{
        users:users
    }
   })

})

exports.getUser=catchAsync(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
      return next(new AppError("there is no user with this is"),404)
    }

    res.status(200).json({
      status:"success",
      data:{
        user
      }
    })
})
exports.deleteUser=catchAsync(async(req,res,next)=>{
     const deletedUser= await User.findByIdAndDelete(req.params.id);
     console.log(deletedUser)
     if(!deletedUser) {
      const error =new AppError("there is no user with this id to delete",404)
     
         next(error)
      
     }
     res.status(200).json({
       status:"success",
       data:null,
       userdeletedis:deletedUser.name
     })
})

exports.updateUser=(async(req,res,next)=>{
   const updateUser=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
     if(!updateUser){
      return next(new AppError("there is no user with this info to update",404))
     }

     res.status(200).json({
      status:"success",
      updatedTo:updateUser
     })
})