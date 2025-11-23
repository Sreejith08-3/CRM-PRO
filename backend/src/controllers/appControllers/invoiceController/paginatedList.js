// backend/src/controllers/appControllers/invoiceController/paginatedList.js
const mongoose = require('mongoose');

const Model = mongoose.model('Invoice');

const paginatedList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = page * limit - limit;

    const { sortBy = 'enabled', sortValue = -1, filter, equal } = req.query;

    const fieldsArray = req.query.fields ? req.query.fields.split(',') : [];

    let fields = fieldsArray.length === 0 ? {} : { $or: [] };

    for (const field of fieldsArray) {
      fields.$or.push({ [field]: { $regex: new RegExp(req.query.q || '', 'i') } });
    }

    // Build base query
    const baseQuery = {
      removed: false,
      ...(filter ? { [filter]: equal } : {}),
      ...fields,
    };

    // Scoping to createdBy for non-admin users
    const adminUser = req.admin || null;
    let isAdmin = false;
    if (adminUser) {
      const role = (adminUser.role || '').toString();
      isAdmin = !!adminUser.isAdmin || /admin|super|root/i.test(role);
    }
    const scopeAll = String(req.query.scope || '').toLowerCase() === 'all';

    if (!isAdmin && !scopeAll && adminUser && adminUser._id) {
      baseQuery.createdBy = adminUser._id;
    }

    // Query the database for a list of results
    const resultsPromise = Model.find(baseQuery)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortValue })
      .populate('createdBy', 'name')
      .exec();

    // Counting the total documents
    const countPromise = Model.countDocuments(baseQuery);

    // Resolving both promises
    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    // Calculating total pages
    const pages = Math.ceil(count / limit) || 0;

    // Getting Pagination Object
    const pagination = { page, pages, count };
    if (count > 0) {
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: 'Successfully found invoices',
      });
    } else {
      return res.status(203).json({
        success: true,
        result: [],
        pagination,
        message: 'Collection is Empty',
      });
    }
  } catch (err) {
    console.error('invoice paginatedList error:', err);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Server error while fetching invoices',
    });
  }
};

module.exports = paginatedList;
