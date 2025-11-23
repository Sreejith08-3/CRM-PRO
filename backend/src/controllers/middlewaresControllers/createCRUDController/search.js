const search = async (Model, req, res) => {
  // console.log(req.query.fields)
  // if (req.query.q === undefined || req.query.q.trim() === '') {
  //   return res
  //     .status(202)
  //     .json({
  //       success: false,
  //       result: [],
  //       message: 'No document found by this request',
  //     })
  //     .end();
  // }
  const fieldsArray = req.query.fields ? req.query.fields.split(',') : ['name'];

  const fields = { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, 'i') } });
  }

  // Scoping logic
  const adminUser = req.admin || null;
  let isAdmin = false;
  if (adminUser) {
    const role = (adminUser.role || '').toString();
    isAdmin = !!adminUser.isAdmin || /admin|super|root/i.test(role);
  }

  const baseQuery = {
    ...fields,
    removed: false,
  };

  if (!isAdmin && adminUser && adminUser._id) {
    const hasCreatedBy = Model.schema.paths.createdBy;
    const hasAssigned = Model.schema.paths.assigned;

    if (hasCreatedBy && hasAssigned) {
      baseQuery.$and = [
        {
          $or: [
            { createdBy: adminUser._id },
            { assigned: adminUser._id }
          ]
        }
      ];
    } else if (hasCreatedBy) {
      baseQuery.createdBy = adminUser._id;
    } else if (hasAssigned) {
      baseQuery.assigned = adminUser._id;
    }
  }

  let results = await Model.find(baseQuery)

    .limit(20)
    .exec();

  if (results.length >= 1) {
    return res.status(200).json({
      success: true,
      result: results,
      message: 'Successfully found all documents',
    });
  } else {
    return res
      .status(202)
      .json({
        success: false,
        result: [],
        message: 'No document found by this request',
      })
      .end();
  }
};

module.exports = search;
