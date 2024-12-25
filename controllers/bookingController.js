const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/asyncError');
const stripe = require('stripe')(process.env.STRIPEPRIVATEKEY);
const Car = require('../models/carModel');
const Booking=require('./../models/bookingModel')
exports.createSession = catchAsync(async (req, res, next) => {
    // 1) Get the car details
    const car = await Car.findById(req.params.carId);

    if (!car) {
        return next(new AppError('No car found with that ID', 404));
    }

    // 2) Create the Stripe checkout session
   const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${process.env.SUCCESSURL}api/v1/car/checkout-session?user=${req.user.id}&car=${req.params.carId}&price=${car.pricePerDay}`,
    cancel_url: process.env.CANCELURL,
    customer_email: req.user.email,
    client_reference_id: req.params.carId,
    line_items: [
        {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: `${car.name} Car`,
                    description: car.description,
                    images: ['https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg'],
                },
                unit_amount: car.pricePerDay,
            },
            quantity: 1,
        },
    ],
    mode: 'payment',
});



    // 3) Send the session to the client
    res.status(200).json({
        status: 'success',
        session,
    });
});




exports.createcheackoutBooking = catchAsync(async (req, res, next) => {
    // console.log('Entered booking handler');

    // Extract query parameters
    const { car, user, price } = req.query;

    // Log received query parameters
    // console.log("Received query params: ", { car, user, price });

    // Validate parameters
    if (!car || !user || !price) {
        return next(new AppError('Missing booking details in the query parameters', 400));
    }

    // Create a new booking
   const booking = await Booking.create({
    car,
    user,
    paidPrice: price,
});


    if (!booking) {
        return next(new AppError("Booking creation failed", 500));
    }

    // console.log('Booking created successfully:', booking);

    // Redirect to frontend
    res.redirect('https://carrantingf.onrender.com');
});
