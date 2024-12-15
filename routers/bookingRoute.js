const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const Router = express.Router();

Router.route('/cheach-session/:carId')
  .get(authController.protect,bookingController.createSession); 


module.exports=Router