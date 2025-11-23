// backend/src/controllers/middlewaresControllers/createCRUDController/create.js
// Generic Create handler for the createCRUDController system.
// Ensures created documents have createdBy set (when an authenticated user exists).
// Also performs a minimal safety check before saving.

const mongoose = require('mongoose');

/**
 * create(documentModelName, req, res)
 * - ModelName: name of the mongoose model (string)
 * - expects JSON body in req.body
 * - sets createdBy to req.<userModelLowercase>._id if available and not already set
 */
const create = async (Model, req, res) => {
  try {
    // Clone body to avoid accidental mutation
    const body = Object.assign({}, req.body || {});

    // If there is an authenticated user (e.g. req.admin), set createdBy automatically
    // The auth middleware in this project sets req.<userModelLowercase>, e.g. req.admin
    const ModelName = Model.modelName;
    const userKeys = Object.keys(req).filter(
      (k) => k.toLowerCase() === ModelName.toLowerCase() || k === 'admin' || k === ModelName.toLowerCase()
    );
    // prefer req.admin if present
    let reqUser = req.admin || null;
    if (!reqUser && userKeys.length > 0) {
      reqUser = req[userKeys[0]];
    }

    if (reqUser && reqUser._id && !body.createdBy) {
      // assign createdBy so later list/filter operations return this document for that user
      body.createdBy = reqUser._id;
    }

    // Ensure removed flag defaults to false (some models rely on removed)
    if (body.removed === undefined) body.removed = false;

    // Create and save
    const newDoc = new Model(body);
    const saved = await newDoc.save();

    return res.status(201).json({
      success: true,
      result: saved,
      message: `Successfully created ${ModelName}`,
    });
  } catch (error) {
    console.error('Create error for', Model.modelName, error);
    // If mongoose validation error, return 422 with the mongoose errors
    if (error && error.name === 'ValidationError') {
      return res.status(422).json({
        success: false,
        result: null,
        message: 'Validation Error',
        error,
      });
    }
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message || 'Server error',
      error,
    });
  }
};

module.exports = create;
