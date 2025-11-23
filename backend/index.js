require('module-alias/register');
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');
require('dotenv').config();

// Connect to MongoDB
// In serverless, global connection state is preserved across hot invocations
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.DATABASE).catch(err => console.error('MongoDB connection error:', err));
}

// Load all models
// We use __dirname to ensure we look in the right place regardless of CWD
const modelsFiles = globSync('./src/models/**/*.js', { cwd: __dirname });

for (const filePath of modelsFiles) {
  require(path.join(__dirname, filePath));
}

// Import the Express app
const app = require('./src/app');

// Export the app for Vercel (serverless function)
module.exports = app;
