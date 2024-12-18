const User = require('./../models/userModel')
const AppFeatures=require("./../utils/AppFeatures")
// const AppError=require("./../utils/AppError")
const AppError=require("./../utils/AppError")
const catchAsync=require("./../utils/asyncError")
const factoryfn=require('./../controllers/factoryFnc')
const multer=require("multer");
const sharp=require("sharp");
// exports.getAllUser=(req,res)=>{
// const User=require('./../models/userModel')

// }

const filterObject=(bodyObject,...filterObject)=>{
  let newObject={};
  // console.log(bodyObject,filterObject)
     Object.keys(bodyObject).forEach(key=>{
      // console.log(key)
        if(filterObject.includes(key)){
          newObject[key]=bodyObject[key]
        }
     })

     return newObject
}
// const storage=multer.diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,'public/images/users')
//   },
//   filename:(req,file,cb)=>{
//      const extention=file.mimetype.split('/')[1]
//      cb(null,`user-${req.user.id}-${Date.now()}.${extention}`)
//   }
// })

const storage=multer.memoryStorage()
const filterMulter=(req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null,true)
  }
  else{
    cb(new AppError("please upload a right image type img"),false)
  }
}
const upload=multer({
  storage:storage,
  fileFilter:filterMulter
})
// const storage =multer.diskStorage({
//   destination:(req,file,cb)=>{
//       cb(null,"/public/images/users")
//   },
//   filename:(req,file,cb)=>{
//       cb(null,)
//   }
// })
exports.resizeImage=async(req,res,next)=>{
   if(!req.file.buffer) return next()
   req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`
   await sharp(req.file.buffer)
  .resize(500,500)
  .toFormat("jpeg")
  .jpeg({quality:90})
  .toFile(`public/images/users/${req.file.filename}`)

  next()
}

exports.uploadImage=upload.single("photo")
exports.updateMe=catchAsync(async(req,res,next)=>{
  // console.log("file uploaded is ",req.file)
  // console.log('entered  update me')
  //  console.log(req.user)
  const filteredObjectResul=filterObject(req.body,"name","email")
  if(req.file){
    filteredObjectResul.photo=req.file.filename;
  }
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
