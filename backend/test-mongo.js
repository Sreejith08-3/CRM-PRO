// backend/test-mongo.js
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
const uri = process.env.DATABASE;
console.log('Testing DB URI (masked):', uri ? uri.replace(/:(.+)@/, ':*****@') : 'no DATABASE env found');

mongoose.connect(uri, { connectTimeoutMS: 10000 })
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    return mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ Connection failed — error.message:');
    console.error(err.message);
    process.exit(1);
  });
