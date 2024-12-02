const { models } = require("mongoose");
const AppFeatures=require('./../utils/AppFeatures')

exports.createOne=(Model)=>catchAsync(async(req,res)=>{
 const instance=await Model.create(req.body)
   res.status(200).json({
     status:"success",
     data:instance
   })
})
exports.deleteOne=(Model)=>catchAsync(async(req,res,next)=>{
     const deletedInstance= await Model.findByIdAndDelete(req.params.id);
    
     if(!deletedInstance) {
      const error =new AppError("there is no user with this id to delete",404)
     
         next(error)
      
     }
     res.status(200).json({
       status:"success",
       data:null,
       userdeletedis:deletedInstance.name
     })
})

exports.updateOne=(Model)=>catchAsync((async(req,res,next)=>{
  console.log("entered update page")
   const updatedInstance=await Model.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
     if(!updatedInstance){
      return next(new AppError("there is no user with this info to update",404))
     }

     res.status(200).json({
      status:"success",
      updatedTo:updatedInstance
     })
}))

exports.getOne=(Model)=>catchAsync(async(req,res,next)=>{
  console.log("entered get one ")
    const GetedInstance = await Model.findById(req.params.id);
    if(!GetedInstance){
      return next(new AppError("there is no data with this is"),404)
    }

    res.status(200).json({
      status:"success",
      data:GetedInstance
      
    })
})
exports.getAll=(Model)=>catchAsync(async(req,res,next)=>{
  
         console.log('entered getalll')
         const feature=new AppFeatures(Model.find(),req.query)
         .filter()
         .sort()
         .fields()
         .pagination();
         const instanceFiltered=await feature.databaseQuery
     
         if(!instanceFiltered){
            return next(new AppError("there is no any data",404))
         }

        res.status(200).json({
            status:"success",
            length:instanceFiltered.length,
            instanceFiltered
        })
})
