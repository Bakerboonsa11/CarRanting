const express=require("express")


const Router=express.Router()
const viewController=require('./../controllers/viewController')

Router.route("/")
.get(viewController.viewAll)



module.exports=Router