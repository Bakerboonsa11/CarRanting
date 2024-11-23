const express=require('express');

const Router=express.Router()
const userController=require("./../controllers/userController")
const authController=require("./../controllers/authController")
//  AUTH ROUTES

Router.post('/signUp',authController.signUp)
Router.post('/signIn',authController.signIn)
Router.post("/ForgetPassword",authController.ForgetPassword)
Router.post("/forgetPassword/:reset_password",authController.restPassword)
Router.route('/')
.get(authController.IsLOggedIn,userController.getUsers)
.post(userController.createUser)

Router.route('/:id')
.get(userController.getUser)
.delete(userController.deleteUser)
.patch(userController.updateUser)
module.exports=Router