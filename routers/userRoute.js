const express=require('express');

const Router=express.Router()
const userController=require("./../controllers/userController")
const authController=require("./../controllers/authController")
//  AUTH ROUTES

Router.post('/signUp',authController.signUp)
Router.post('/signIn',authController.signIn)
Router.get('/logOut',authController.logOut)
Router.patch('/updateMe',authController.protect,userController.uploadImage,userController.resizeImage,userController.updateMe)
Router.post("/ForgetPassword",authController.ForgetPassword)
Router.get("/forgetPassword/:reset_password",authController.restPassword)
Router.patch("/updatePassword",authController.protect,authController.updatePassword)
Router.route('/')
.get(authController.protect,userController.getUsers)
.post(userController.createUser)

Router.route('/:id')
.get(userController.getUser)
.delete(userController.deleteUser)
.patch( authController.protect,userController.updateUser)
module.exports=Router