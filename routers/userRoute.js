const express=require('express');

const Router=express.Router()
const userController=require("./../controllers/userController")

Router.route('/')
.get(userController.getUsers)
.post(userController.createUser)

Router.route('/:id')
.get(userController.getUser)
.delete(userController.deleteUser)
.patch(userController.updateUser)
module.exports=Router