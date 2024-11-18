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