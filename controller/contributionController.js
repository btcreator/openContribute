const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const Contribution = require('./../model/contribution');
const Project = require('./../model/project');
const { cleanBody } = require('../utils/cleanIOdata');
const RefineQuery = require('../utils/refineQuery');
const { ObjectId } = require('mongoose').Types;

// Check if the resource is needed for the project and if the limit is not exceeded
const _clarifyResourceAndLimit = async function (projectId, resourceName, amountChange, guest) {
  // search for project to which the contribution belongs
  const _id = new ObjectId(`${projectId}`);
  const project = await Project.findOne({ _id, 'resources.name': resourceName }).select('resources');

  // check project presence - project not exists or the resource does not need for that project
  if (!project) throw new AppError(404, 'Project resource to contribute to, is not found.');

  // extract the resource from project and check if it needs an authentication
  const projectsResource = project.resources.find((obj) => obj.name === resourceName);
  if (guest && projectsResource.auth)
    throw new AppError(401, 'You need to be logged in to contribute with this resource.');

  // get the total amount contributed to the resource
  const resource = await Contribution.aggregate([
    {
      $match: {
        project: _id,
        resource: resourceName,
      },
    },
    {
      $group: {
        _id: '$project',
        amount: {
          $sum: '$amount',
        },
      },
    },
  ]);

  // deny contribution if the maximal limit would be exceeded with this contribution
  const totalAmount = resource[0]?.amount ?? 0;
  if (totalAmount + amountChange > projectsResource.limit?.max)
    throw new AppError(400, 'Contribution not accepted, because the max limit of the resource would be exceeded.');
};

// Update contribution
const _updateContributionAndSend = async function (res, contribution, toUpdateAmount, isGuest) {
  // when exists something to update
  if (toUpdateAmount) {
    const { project, resource, amount: actAmount } = contribution;

    // controlling the project for the specific resource and check the limit if its exceeded
    await _clarifyResourceAndLimit(project, resource, toUpdateAmount - actAmount, isGuest);

    contribution.amount = toUpdateAmount;
    await contribution.save();
  }

  res.status(200).json({
    status: 'success',
    data: {
      contribution,
    },
  });
};

// Create contribution
const _createContributionAndSend = async function (res, payload, isGuest) {
  const { project, resource, amount } = payload;

  // controlling the project for the specific resource and check the limit if its exceeded
  await _clarifyResourceAndLimit(project, resource, amount, isGuest);

  const contribution = await Contribution.create(payload);

  res.status(200).json({
    status: 'success',
    data: {
      contribution,
    },
  });
};

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
  const isGuest = true;

  await _createContributionAndSend(res, bodyCl, isGuest);
});

exports.updateGuestContribution = catchAsync(async (req, res) => {
  const isGuest = true;
  /*prettier-ignore*/
  const contribution = await Contribution.findOne({guestPassToken: req.guestPassToken, resource: { $ne: 'funds' }});
  if (!contribution) throw new AppError(404, 'No contribution found.');

  await _updateContributionAndSend(res, contribution, req.body.amount, isGuest);
});

// a contribution is removed, when a user resigns
exports.deleteGuestContribution = catchAsync(async (req, res) => {
  await Contribution.deleteOne({ guestPassToken: req.guestPassToken, resource: { $ne: 'funds' } });

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

exports.getAllMyContributions = catchAsync(async (req, res) => {
  const contriQuery = Contribution.find({});

  const query = new RefineQuery(contriQuery, req.query).refine({ user: req.user._id });
  const contributions = await query;

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
  const isGuest = false;
  const bodyCl = cleanBody(req.body);
  bodyCl.user = req.user._id;

  await _createContributionAndSend(res, bodyCl, isGuest);
});

exports.updateMyContribution = catchAsync(async (req, res) => {
  const isGuest = false;
  const _id = new ObjectId(`${req.params.id}`);
  const contribution = await Contribution.findOne({ _id, resource: { $ne: 'funds' } });
  if (!contribution) throw new AppError(404, 'No contribution eligible to update is found.');

  await _updateContributionAndSend(res, contribution, req.body.amount, isGuest);
});

exports.deleteMyContribution = catchAsync(async (req, res) => {
  const _id = new ObjectId(`${req.params.id}`);
  await Contribution.deleteOne({ _id, resource: { $ne: 'funds' } });

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
  const isGuest = !bodyCl.user;

  await _createContributionAndSend(res, bodyCl, isGuest);
});

exports.updateContribution = catchAsync(async (req, res) => {
  const isGuest = false;
  const _id = new ObjectId(`${req.params.id}`);
  const contribution = await Contribution.findOne({ _id, resource: { $ne: 'funds' } }).select('+guestPassToken');
  if (!contribution) throw new AppError(404, 'No contribution eligible to update is found.');

  await _updateContributionAndSend(res, contribution, req.body.amount, isGuest);
});

exports.deleteContribution = catchAsync(async (req, res) => {
  await Contribution.findByIdAndDelete(req.params.id);

  res.status(204).end();
});

exports.getAllContributions = catchAsync(async (req, res) => {
  const contriQuery = Contribution.find({}).select('+guestPassToken');

  const query = new RefineQuery(contriQuery, req.query).refine();
  const contributions = await query;

  res.status(200).json({
    status: 'success',
    results: contributions.length,
    data: {
      contributions,
    },
  });
});
