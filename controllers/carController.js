const Car=require('./../models/carModel');



exports.createCar=async(req,res)=>{
try{
const createdCar=await Car.create({
      make: 'Toyota',
      name:"toyota",
      model: 'Corolla',
      year: 2022,
      pricePerDay: 50,
      mileage: 15000,
      fuelType: 'Gas',
      transmission: 'Automatic',
      color: 'White',
      description: 'A compact and reliable car, great for city and highway driving.',
      images: [
        'https://example.com/images/toyota-corolla-front.jpg',
        'https://example.com/images/toyota-corolla-side.jpg',
      ],
      location: {
        type: 'Point',
        coordinates: [-122.4194, 37.7749], // Example coordinates (San Francisco)
      },
    })

  res.status(200).json({
    carCreated:createdCar
  })
}
catch(error){
   console.log("there is error with creating the car")
   console.log(error)
}
}