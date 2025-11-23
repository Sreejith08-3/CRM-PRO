const path = require('path');
const moduleAlias = require('module-alias');

// Register alias programmatically for Vercel
moduleAlias.addAlias('@', path.join(__dirname, 'src'));

const mongoose = require('mongoose');
require('dotenv').config();

// Force include middleware to ensure Vercel bundles it
try {
  require('./src/controllers/middlewaresControllers/createAuthMiddleware');
} catch (e) {
  console.log('Middleware preload check');
}

// Connect to MongoDB
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.DATABASE)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Explicitly load models to ensure they are registered in Vercel environment
// Core Models
require('./src/models/coreModels/Admin');
require('./src/models/coreModels/AdminPassword');
require('./src/models/coreModels/Setting');
require('./src/models/coreModels/Upload');

// App Models
require('./src/models/appModels/Client');
require('./src/models/appModels/Invoice');
require('./src/models/appModels/Payment');
require('./src/models/appModels/PaymentMode');
require('./src/models/appModels/Quote');
require('./src/models/appModels/Taxes');

// Import the Express app
const app = require('./src/app');

// Export the app for Vercel (serverless function)
module.exports = app;
