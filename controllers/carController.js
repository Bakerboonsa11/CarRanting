const Car=require('./../models/carModel');
const AppFeatures=require("./../utils/AppFeatures")



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
        
        //  const AllCar=await Car.find();
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
exports.getOneCar=async(req,res)=>{
    try{
        const car=await Car.findById(req.params.id)
        if(!car){
            return res.status(404).json({
                status:"fail",
                message:"there is no car with is id"
            })
        }

        res.status(200).json({
            status:"success",
            data:{
                car
            }
        })
    }
    catch(error){

    }
}
exports.createCar=async(req,res)=>{
try{

const createdCar=await Car.create(req.body)

  res.status(200).json({
    carCreated:createdCar
  })
}
catch(error){
   console.log("there is error with creating the car")
   console.log(error)
}
}

exports.updateCar=async(req,res)=>{
    try{
    
        const updatedUser= await Car.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!updatedUser){
            return res.status(404).json({
                status:"fail",
                message:"there is no user with this data"
            })
        }

      res.status(200).json({
        updatedUser:updatedUser
      })
    }
    catch(error){
        console.log(error)
    }

}

exports.deleteCar=async(req,res)=>{
    try{
       const doc= await Car.findByIdAndDelete(req.params.id)
       if(!doc){
        return res.status(404).json({
            status:"fail",
            message:"there is no car with this information"
        })
       }
        res.status(200).json({
            status:"success",
            message:"car is deleted succesfully"
        })
    }
    catch(error){
       console.log(error)
    }
  
}
