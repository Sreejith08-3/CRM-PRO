/**
 * backend/src/app.js
 * Updated full version with working public registration route
 * that creates both Admin and AdminPassword records.
 */

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter');
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');
const erpApiRouter = require('./routes/appRoutes/appApi');

const adminAuth = require('./controllers/coreControllers/adminAuth');
const errorHandlers = require('./handlers/errorHandlers');

// ------------------------------------------
// Express app setup
// ------------------------------------------
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
// app.use(fileUpload()); // optional

// ------------------------------------------
// Load Admin model (registered by server.js)
// ------------------------------------------
let AdminModel = null;
try {
  AdminModel = mongoose.model('Admin');
} catch (e) {
  const registered = mongoose.modelNames();
  const foundName = registered.find((n) => /admin|user/i.test(n));
  if (foundName) {
    console.warn(`Using alternative model for registration: ${foundName}`);
    AdminModel = mongoose.model(foundName);
  } else {
    console.error('Admin model not found. Registered models:', registered);
  }
}

// ------------------------------------------
// Public registration route
// ------------------------------------------
app.post('/api/register', async (req, res) => {
  try {
    if (!AdminModel) {
      return res
        .status(500)
        .json({ success: false, message: 'Server misconfiguration: user model not available' });
    }

    const { name, email, password, company, country } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and password are required' });
    }

    const emailNorm = String(email).toLowerCase().trim();

    // Check duplicate email
    const existing = await AdminModel.findOne({ email: emailNorm });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    // Generate salt + hash (the system compares bcrypt(salt + password))
    const salt = await bcrypt.genSalt(10);
    const saltedHash = await bcrypt.hash(salt + password, 10);

    // Role selection (fallback if enum restricted)
    let roleToSet = undefined;
    const rolePath =
      AdminModel.schema && AdminModel.schema.path && AdminModel.schema.path('role');
    if (rolePath && Array.isArray(rolePath.enumValues) && rolePath.enumValues.length > 0) {
      if (rolePath.enumValues.includes('user')) {
        roleToSet = 'user';
      } else {
        const nonAdmin = rolePath.enumValues.find((v) => !/admin|super|root/i.test(v));
        roleToSet = nonAdmin || rolePath.enumValues[0];
      }
    }

    const hasIsAdmin =
      AdminModel.schema && AdminModel.schema.path && AdminModel.schema.path('isAdmin');

    const newUserData = {
      name: name || 'User',
      email: emailNorm,
      company: company || '',
      country: country || '',
      createdAt: new Date(),
      enabled: true,
    };
    if (roleToSet !== undefined) newUserData.role = roleToSet;
    if (hasIsAdmin) newUserData.isAdmin = false;

    // Create new Admin document
    const newUser = new AdminModel(newUserData);
    await newUser.save();

    // ---------------------------------------------------------
    // Create corresponding AdminPassword document (important!)
    // ---------------------------------------------------------
    try {
      let AdminPasswordModel;
      try {
        AdminPasswordModel = mongoose.model('AdminPassword');
      } catch (err) {
        const registered = mongoose.modelNames();
        const foundName = registered.find((n) => /adminpassword/i.test(n));
        if (foundName) AdminPasswordModel = mongoose.model(foundName);
      }

      if (AdminPasswordModel) {
        const passDoc = new AdminPasswordModel({
          user: newUser._id,
          password: saltedHash,
          salt: salt,
          emailVerified: false,
          authType: 'email',
          loggedSessions: [],
        });
        await passDoc.save();
      } else {
        console.warn('⚠️ AdminPassword model not found — password record skipped');
      }
    } catch (pwErr) {
      console.error('Failed to create AdminPassword record:', pwErr);
      return res
        .status(500)
        .json({ success: false, message: 'Error creating password record', error: pwErr.message });
    }

    // Success response
    const safeUser = newUser.toObject();
    delete safeUser.password;

    return res.status(201).json({ success: true, message: 'Registered successfully', result: safeUser });
  } catch (err) {
    console.error('Public register error:', err);
    if (err && err.name === 'ValidationError') {
      const firstKey = Object.keys(err.errors || {})[0];
      const firstMsg = firstKey ? err.errors[firstKey].message : err.message;
      return res
        .status(400)
        .json({ success: false, message: 'Validation error', error: firstMsg });
    }
    return res
      .status(500)
      .json({ success: false, message: 'Server error', error: err.message });
  }
});

// ------------------------------------------
// API routes
// ------------------------------------------
app.use('/api', coreAuthRouter);
app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);
app.use('/api', adminAuth.isValidAuthToken, erpApiRouter);
app.use('/download', coreDownloadRouter);
app.use('/public', corePublicRouter);

// 404 + Error handlers
app.use(errorHandlers.notFound);
app.use(errorHandlers.productionErrors);

// Export app
module.exports = app;
