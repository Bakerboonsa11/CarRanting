const Car=require('./../models/carModel');
const AppFeatures=require("./../utils/AppFeatures")
// const AppError=require("./../utils/AppError")
const AppError=require("./../utils/AppError")
const catchAsync=require("./../utils/asyncError")
const factoryfn=require('./../controllers/factoryFnc')
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
exports.getAllCar=factoryfn.getAll(Car)

exports.getOneCar=factoryfn.getOne(Car)
exports.createCar=factoryfn.createOne(Car)

exports.updateCar=factoryfn.updateOne(Car) 

exports.deleteCar=factoryfn.deleteOne(Car)
