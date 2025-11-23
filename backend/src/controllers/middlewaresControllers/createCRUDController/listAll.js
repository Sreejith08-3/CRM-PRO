// backend/src/controllers/middlewaresControllers/createCRUDController/listAll.js
const listAll = async (Model, req, res) => {
  try {
    const sort = req.query.sort || 'desc';
    const enabled = req.query.enabled || undefined;

    // Build base query
    const baseQuery = {
      removed: false,
      ...(enabled === undefined ? {} : { enabled: enabled }),
    };

    // Apply createdBy scoping same as paginatedList
    const adminUser = req.admin || null;
    let isAdmin = false;
    if (adminUser) {
      const role = (adminUser.role || '').toString();
      isAdmin = !!adminUser.isAdmin || /admin|super|root/i.test(role);
    }
    const scopeAll = String(req.query.scope || '').toLowerCase() === 'all';
    if (!isAdmin && !scopeAll && adminUser && adminUser._id) {
      const hasCreatedBy = Model.schema.paths.createdBy;
      const hasAssigned = Model.schema.paths.assigned;

      if (hasCreatedBy && hasAssigned) {
        baseQuery.$or = [
          { createdBy: adminUser._id },
          { assigned: adminUser._id }
        ];
      } else if (hasCreatedBy) {
        baseQuery.createdBy = adminUser._id;
      } else if (hasAssigned) {
        baseQuery.assigned = adminUser._id;
      }
    }

    // Query
    const result = await Model.find(baseQuery).sort({ created: sort }).populate().exec();

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        result,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(203).json({
        success: false,
        result: [],
        message: 'Collection is Empty',
      });
    }
  } catch (err) {
    console.error('listAll error:', err);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Server error in listAll',
    });
  }
};

module.exports = listAll;
