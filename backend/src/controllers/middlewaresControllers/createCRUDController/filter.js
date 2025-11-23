const filter = async (Model, req, res) => {
  if (req.query.filter === undefined || req.query.equal === undefined) {
    return res.status(403).json({
      success: false,
      result: null,
      message: 'filter not provided correctly',
    });
  }
  const adminUser = req.admin || null;
  let isAdmin = false;
  if (adminUser) {
    const role = (adminUser.role || '').toString();
    isAdmin = !!adminUser.isAdmin || /admin|super|root/i.test(role);
  }

  const baseQuery = {
    removed: false,
  };

  if (!isAdmin && adminUser && adminUser._id) {
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

  const result = await Model.find(baseQuery)
    .where(req.query.filter)
    .equals(req.query.equal)
    .exec();
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  } else {
    // Return success resposne
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found all documents  ',
    });
  }
};

module.exports = filter;
