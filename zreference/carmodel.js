// CAR MODEL

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
  make: { type: String, required: true }, // Car manufacturer
  model: { type: String, required: true }, // Car model
  year: { type: Number, required: true }, // Year of manufacture
  pricePerDay: { type: Number, required: true }, // Rental price per day
  mileage: { type: Number, required: true }, // Mileage (e.g., miles driven)
  fuelType: { type: String, enum: ['Gas', 'Diesel', 'Electric', 'Hybrid'], required: true },
  transmission: { type: String, enum: ['Automatic', 'Manual'], required: true }, // Transmission type
  color: { type: String, required: true }, // Color of the car
  description: { type: String, required: true }, // A short description about the car
  images: [{ type: String }], // Array of image URLs (can be links to cloud storage)
  location: { 
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true } // [longitude, latitude] for geospatial queries
  },
  createdAt: { type: Date, default: Date.now }, // Date the car was added
  updatedAt: { type: Date, default: Date.now }, // Date when the car details were last updated
});

carSchema.index({ location: '2dsphere' }); // Index for geospatial queries
const Car = mongoose.model('Car', carSchema);

module.exports = Car;
