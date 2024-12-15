const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/asyncError');
const stripe = require('stripe')(process.env.STRIPEPRIVATEKEY);
const Car = require('../models/carModel');

exports.createSession = catchAsync(async (req, res, next) => {
    // 1) Get the car details
    const car = await Car.findById(req.params.carId);

    if (!car) {
        return next(new AppError('No car found with that ID', 404));
    }

    // 2) Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'], // Only accept card payments
        success_url: process.env.SUCCESSURL,
        cancel_url: process.env.CANCELURL,
        customer_email: req.user.email, // Email of the current user
        client_reference_id: req.params.carId, // Car ID for reference
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${car.name} Car`, // Car name
                        description: car.description, // Car description
                        images: ['https://www.natours.dev/img/tours/tour-5c88fa8cf4a4da39709c2951-1553152659745-cover.jpeg'], // Optional: Car image
                    },
                    unit_amount: car.pricePerDay, // Price in cents
                },
                quantity: 1, // Number of cars to book (default 1)
            },
        ],
        mode: 'payment', // Mode for one-time payment
    });

    // 3) Send the session to the client
    res.status(200).json({
        status: 'success',
        session,
    });
});
