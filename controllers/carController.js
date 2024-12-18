const Car=require('./../models/carModel');
const AppFeatures=require("./../utils/AppFeatures")
// const AppError=require("./../utils/AppError")
const AppError=require("./../utils/AppError")
const catchAsync=require("./../utils/asyncError")
const factoryfn=require('./../controllers/factoryFnc')
const multer =require("multer");
const sharp =require("sharp");
const Email=require('../utils/sendEmail.js')
const storage=multer.memoryStorage();
const Booking=require("./../models/bookingModel.js")
const User=require('./../models/userModel.js')
const filterMulter=(req,file,cb)=>{
  if(file.mimetype.startsWith("image")){
    cb(null,true)
  }
  else {
    cb(new AppError("invalid file type please provide imge",400),false)
  }
}
const upload=multer({
  storage,
  filterMulter
})

exports.uploadFiles=upload.fields([{
    name:"images",
    maxCount:3
}
])

exports.processImages = async (req, res, next) => {
    // console.log("files are", req.files);
    const files = [];

    // Map over files and return an array of promises
    const promises = req.files.images.map(async (element, index) => {
        const fileName = `car-${req.params.id}-${index}.jpeg`; // Add file extension
        // console.log(fileName);

        await sharp(element.buffer)
            .resize(500, 500)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`public/images/cars/${fileName}`);

        files.push(fileName); // Correctly push fileName (with extension) to files array
    });

    // Wait for all promises to resolve
    await Promise.all(promises);
    req.files=files
    // console.log(files); // Now this will contain all processed file names
    next();
};

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

exports.getMyCars = catchAsync(async (req, res, next) => {
  const userId = req.user.id;  // Get the user ID from the authenticated user
  console.log(userId);

  if (!userId) {
    return next(new AppError('Please login first to access', 400));  // Return error if user is not authenticated
  }

  // Find bookings related to the logged-in user and populate the user and car fields
  const bookings = await Booking.find({ user: userId })
    .populate('user', 'name email')  // Populate user field with specific fields (name, email)
    .populate('car');  // Populate car field with specific car details

  if (!bookings || bookings.length === 0) {
    return next(new AppError('There are no bookings at all', 400));  // Return error if no bookings found
  }

  res.status(200).json({
    status: 'success',
    bookings,  // Return the populated bookings
  });
});

exports.getAllCar=factoryfn.getAll(Car)

exports.getOneCar=factoryfn.getOne(Car)
exports.createCar=factoryfn.createOne(Car)

exports.updateCar=factoryfn.updateOne(Car) 

exports.deleteCar=factoryfn.deleteOne(Car)
