const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const Contribution = require('./../model/contribution');
const { cleanBody } = require('../utils/cleanIOdata');
const RefineQuery = require('../utils/refineQuery');
const { ObjectId } = require('mongoose').Types;

// Public operations
////
exports.getStats = catchAsync(async (req, res) => {
  //
});

// Contribution GUEST operations
////
exports.getGuestContribution = catchAsync(async (req, res) => {
  const contribution = await Contribution.findOne({ guestPassToken: req.guestPassToken });
  if (!contribution) throw new AppError(404, 'No contribution found.');

  res.status(200).json({
    status: 'success',
    data: {
      contribution,
    },
  });
});

exports.createGuestContribution = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body, 'user');
  const contribution = await Contribution.create(bodyCl);

  res.status(200).json({
    status: 'success',
    data: {
      contribution,
    },
  });
});

exports.updateGuestContribution = catchAsync(async (req, res) => {
  const contribution = await Contribution.findOne({
    guestPassToken: req.guestPassToken,
    resource: { $ne: 'funds' },
  });
  if (!contribution) throw new AppError(404, 'No contribution found.');

  // when exists something to update
  if (req.amount) {
    contribution.amount = req.amount;
    await contribution.save();
  }

  res.status(200).json({
    status: 'success',
    data: {
      contribution,
    },
  });
});

// a contribution is removed, when a user resigns
exports.deleteGuestContribution = catchAsync(async (req, res) => {
  await Contribution.findOneAndDelete({ guestPassToken: req.guestPassToken, resource: { $ne: 'funds' } });

  res.status(204).end();
});

// guarding routes. Just for guests
exports.isGuest = (req, res, next) => {
  const guestPassToken = req.query.guestPassToken || req.body.guestPassToken;
  if (!guestPassToken) return next('route');

  req.guestPassToken = guestPassToken;
  next();
};

// Contribution "MY" operations
////
exports.myContributions = catchAsync(async (req, res) => {
  const contributions = await Contribution.aggregate([
    // stage 1 - match all contributions from the logged in user
    {
      $match: { user: req.user._id },
    },
    // stage 2 - build a group by project and resource corresponding to the project and sum the contributed amount
    {
      $group: {
        _id: {
          project: '$project',
          resource: '$resource',
        },
        totalAmount: {
          $sum: '$amount',
        },
      },
    },
    // stage 3 - now regroup just by projects and collect the resources in an array with key value pair
    {
      $group: {
        _id: '$_id.project',
        resources: {
          $push: {
            k: '$_id.resource',
            v: '$totalAmount',
          },
        },
      },
    },
    // stage 4 - convert array to object
    {
      $project: {
        _id: 1,
        resources: {
          $arrayToObject: '$resources',
        },
      },
    },
    // stage 5 - populate the projects id and select just the name
    {
      $lookup: {
        from: 'projects',
        localField: '_id',
        foreignField: '_id',
        as: 'project',
        pipeline: [
          {
            $project: {
              name: 1,
              _id: 0,
            },
          },
        ],
      },
    },
    // stage 6 - the populated project is an array, so unwind it (to objects)
    {
      $unwind: '$project',
    },
    // stage 7 - replace project's value with the project name.
    {
      $addFields: {
        project: '$project.name',
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: contributions.length,
    data: {
      contributions,
    },
  });
});

exports.getMyContribution = catchAsync(async (req, res) => {
  const contribution = await Contribution.findById(req.params.id).populate('project', 'name');

  res.status(200).json({
    status: 'success',
    data: {
      contribution,
    },
  });
});

exports.createMyContribution = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body);
  bodyCl.user = req.user._id;

  const contribution = await Contribution.create(bodyCl);

  res.status(200).json({
    status: 'success',
    data: {
      contribution,
    },
  });
});

exports.updateMyContribution = catchAsync(async (req, res) => {
  const _id = ObjectId(req.params.id);
  const contribution = await Contribution.findOne({ _id, resource: { $ne: 'funds' } });
  if (!contribution) throw new AppError(404, 'No contribution eligible to update is found.');

  // when exists something to update
  if (req.amount) {
    contribution.amount = req.amount;
    await contribution.save();
  }

  res.status(200).json({
    status: 'success',
    data: {
      contribution,
    },
  });
});

exports.deleteMyContribution = catchAsync(async (req, res) => {
  const _id = ObjectId(req.params.id);
  await Contribution.findOneAndDelete({ _id, resource: { $ne: 'funds' } });

  res.status(204).end();
});

// CRUD operations
////
exports.getContribution = catchAsync(async (req, res) => {
  const contribution = await Contribution.findById(req.params.id).populate('user', 'name').populate('project', 'name');

  res.status(200).json({
    status: 'success',
    data: {
      contribution,
    },
  });
});

exports.createContribution = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body);

  const contribution = await Contribution.create(bodyCl);

  res.status(200).json({
    status: 'success',
    data: {
      contribution,
    },
  });
});

exports.updateContribution = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body);

  const contribution = await Contribution.findByIdAndUpdate(req.params.id, bodyCl, {
    runValidators: true,
    returnOriginal: false,
  }).select('+guestPassToken');

  res.status(200).json({
    status: 'success',
    data: {
      contribution,
    },
  });
});

exports.deleteContribution = catchAsync(async (req, res) => {
  await Contribution.findByIdAndDelete(req.params.id);

  res.status(204).end();
});

exports.getAllContributions = catchAsync(async (req, res) => {
  const contiQuery = Contribution.find({});

  const query = new RefineQuery(contiQuery, req.query).refine();
  const contribution = await query;

  res.status(200).json({
    status: 'success',
    results: contribution.length,
    data: {
      contribution,
    },
  });
});
/*
const test = [
  {user: "1", project: "1", resource: "human", amount: "1"},
  {user: "1", project: "1", resource: "tools", amount: "1"},
  {user: "1", project: "2", resource: "human", amount: "2"},
  {user: "1", project: "2", resource: "human", amount: "1"},
  {user: "1", project: "2", resource: "support", amount: "1"},
  {user: "1", project: "3", resource: "tools", amount: "1"},
  {user: "1", project: "3", resource: "space", amount: "1"},
]

[
  {
    project: 'name_1',
    resources: {
      human: '1',
      tool: '1',
    },
  },
  {
    project: 'name_2',
    resources: {
      human: '3',
      support: '1',
    },
  },
  {
    project: 'name_3',
    resources: {
      tools: '1',
      space: '1',
    },
  },
];
*/
