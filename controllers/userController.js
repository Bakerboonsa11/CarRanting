const User = require('./../models/userModel')
const AppFeatures=require("./../utils/AppFeatures")
// const AppError=require("./../utils/AppError")
const AppError=require("./../utils/AppError")
const catchAsync=require("./../utils/asyncError")
const factoryfn=require('./../controllers/factoryFnc')

// exports.getAllUser=(req,res)=>{
// const User=require('./../models/userModel')

// }

const filterObject=(bodyObject,...filterObject)=>{
  let newObject={};
  console.log(bodyObject,filterObject)
     Object.keys(bodyObject).forEach(key=>{
      console.log(key)
        if(filterObject.includes(key)){
          newObject[key]=bodyObject[key]
        }
     })

     return newObject
}

exports.updateMe=catchAsync(async(req,res,next)=>{
  console.log('entered  update me')
   console.log(req.user)
  const filteredObjectResul=filterObject(req.body,"name","email")
 
  const user= await User.findByIdAndUpdate(req.user.id,filteredObjectResul,{new:true,runValidators:true});

if(!user){
  return new AppError("please login first",400)
}
res.status(200).json({
  status:"success",
  updateeduser:user
})
})
exports.deleteUserMe=catchAsync(async(req,res,next)=>{
  const user= await User.findByIdAndDelete(req.user.id);

if(!user){
  return new AppError("please login first",400)
}
res.status(200).json({
  status:"success",
   data:null
})



})
exports.createUser= factoryfn.createOne(User)
exports.getUsers=factoryfn.getAll(User)

exports.getUser=factoryfn.getOne(User)
exports.deleteUser=factoryfn.deleteOne(User)

exports.updateUser=factoryfn.updateOne(User)