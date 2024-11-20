const Car=require('./../models/carModel');
const AppFeatures=require("./../utils/AppFeatures")
// const AppError=require("./../utils/AppError")
const AppError=require("./../utils/AppError")


exports.getTopCar=(req,res,next)=>{
      req.query.pricePerDay=50;
      req.query.limit=3
      req.query.page=1
      req.query.sort="-pricePerDay",
      req.query.fields='name,make,pricePerDay'
      next()
}

exports.getCarStat=async(req,res)=>{
  const stat= await Car.aggregate([
    {
      $match:{fuelType:"Gas"}  
    },
    {
        $group:{
          _id:{$toUpper:'$color'},
          numCar:{$sum:1},
          avragePrice:{$avg:"$pricePerDay"},
          minPrice:{$min:"pricePerDay"},
          maxPrice:{$max:"$pricePerDay"}
        }
    }
  ])

res.status(200).json({
    length:stat.length,
    stats:stat
    
})
}
exports.getAllCar=async(req,res)=>{
    try{
         const query=req.query
       
         const feature=new AppFeatures(Car.find(),req.query).filter().sort().fields().pagination();
      
         const CarsFiltered=await feature.databaseQuery
        
      
         if(!CarsFiltered){
            return res.status('404').json({
                status:"fail",
                message:"there is no any car"
            })
         }

        res.status(200).json({
            status:"success",
            length:CarsFiltered.length,
            cars:CarsFiltered
        })
    }
    catch(error){
         console.log(error)
    }
 

}
exports.getOneCar=async(req,res,next)=>{
    try{
        const car=await Car.findById(req.params.id)
        if(!car){
         throw new Error("there is no car with this id")
        }

        res.status(200).json({
            status:"success",
            data:{
                car
            }
        })
    }
    catch(error){
        console.log('its entered a catch block')
        console.log(error.message)
        next(error.message)
    }
}
exports.createCar=async(req,res,next)=>{
try{

const createdCar=await Car.create(req.body)

  res.status(200).json({
    carCreated:createdCar
  })
}
catch(error){
  next(error.message)
}
}

exports.updateCar=async(req,res,next)=>{
    try{
    
        const updatedUser= await Car.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!updatedUser){
            throw new Error("there is no car with this info to update")
        }

      res.status(200).json({
        updatedUser:updatedUser
      })
    }
    catch(error){
       console.log(error.message)
       next(error.message)
    }

}

exports.deleteCar=async(req,res,next)=>{
    try{
       const doc= await Car.findByIdAndDelete(req.params.id)
       if(!doc){
       throw new Error("there is no car with this info to delete")
       }
        res.status(200).json({
            status:"success",
            message:"car is deleted succesfully"
        })
    }
    catch(error){
       console.log(error)
       next(error.message)
    }
  
}
