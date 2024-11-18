const Car=require('./../models/carModel');



exports.createCar=async(req,res)=>{
try{
console.log(req.body)
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
        console.log(req.params.id,req.body)
        const updatedUser= await Car.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!updatedUser){
            return res.status(404).json({
                status:"fail",
                message:"there is no user with this daat"
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
            message:"there is no car with this info"
        })
       }
        res.status(200).json({
            status:"success",
            message:"a car is deleted successfully"
        })
    }
    catch(error){
       console.log(error)
    }
  
}
