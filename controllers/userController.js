const User = require('./../models/userModel')
const AppFeatures=require("./../utils/AppFeatures")
// const AppError=require("./../utils/AppError")
const AppError=require("./../utils/AppError")
const catchAsync=require("./../utils/asyncError")
const factoryfn=require('./../controllers/factoryFnc')

// exports.getAllUser=(req,res)=>{
// const User=require('./../models/userModel')

// }

exports.createUser= factoryfn.createOne(User)
exports.getUsers=factoryfn.getAll(User)

exports.getUser=factoryfn.getOne(User)
exports.deleteUser=factoryfn.deleteOne(User)

exports.updateUser=factoryfn.updateOne(User)