const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const Contribution = require('./../model/contribution');
const Project = require('./../model/project');
const User = require('./../model/user');
const { cleanBody } = require('../utils/cleanIOdata');
const RefineQuery = require('../utils/refineQuery');
const { ObjectId } = require('mongoose').Types;
const {
  summaryPipeline,
  resourcePipeline,
  projectsContributorsPipeline,
} = require('./aggregationPipelines/contributionPipelines');

// Check if the resource is needed for the project and if the limit is not exceeded
const _clarifyResourceAndLimit = async function (projectId, resourceName, amountChange, guest) {
  // search for project to which the contribution belongs
  const projIdObj = new ObjectId(`${projectId}`);
  const project = await Project.findOne({ _id: projIdObj, 'resources.name': resourceName, isActive: true }).select(
    'resources'
  );

  // check project presence - project not exists or the resource does not need for that project
  if (!project) throw new AppError(404, 'Project resource to contribute to, is not found.');

  // extract the resource from project and check if it needs an authentication
  const projectsResource = project.resources.find((obj) => obj.name === resourceName);
  if (guest && projectsResource.auth)
    throw new AppError(401, 'You need to be logged in to contribute with this resource.');

  // get the total amount contributed to the resource
  const resource = await Contribution.aggregate(resourcePipeline(projIdObj, resourceName));

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

  res.status(201).json({
    status: 'success',
    data: {
      contribution,
    },
  });
};

// Public operations
////
exports.getProjectsContributors = catchAsync(async (req, res) => {
  const projectId = new ObjectId(`${req.params.id}`);
  const contributors = await Contribution.aggregate(projectsContributorsPipeline(projectId));

  res.status(200).json({
    status: 'success',
    data: {
      contributors,
    },
  });
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
exports.myContributionsSummary = catchAsync(async (req, res) => {
  const contributions = await Contribution.aggregate(summaryPipeline(req.user._id));

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
  const _id = new ObjectId(`${req.params.id}`);
  const contribution = await Contribution.findOne({ _id, user: req.user._id }).populate('project', 'name');
  if (!contribution) throw new AppError(404, 'No contribution found.');

  res.status(200).json({
    status: 'success',
    data: {
      contribution,
    },
  });
});

exports.updateMyContribution = catchAsync(async (req, res) => {
  const isGuest = false;
  const _id = new ObjectId(`${req.params.id}`);
  const contribution = await Contribution.findOne({ _id, user: req.user._id, resource: { $ne: 'funds' } });
  if (!contribution) throw new AppError(404, 'No contribution eligible to update is found.');

  await _updateContributionAndSend(res, contribution, req.body.amount, isGuest);
});

exports.deleteMyContribution = catchAsync(async (req, res) => {
  const _id = new ObjectId(`${req.params.id}`);
  await Contribution.deleteOne({ _id, user: req.user._id, resource: { $ne: 'funds' } });

  res.status(204).end();
});

// CRUD operations
////
exports.createContribution = catchAsync(async (req, res) => {
  // initiate most secure values
  let isGuest = true;
  let bodyCl = {};

  // if its an authorized user
  if (req.user) {
    bodyCl = cleanBody(req.body);
    isGuest = false;

    // not an admin or when an admin, but not provide a user id (contribute self as user)
    if (req.user.role !== 'admin' || !bodyCl.user) bodyCl.user = req.user._id;
    // when an admin and provide a user id (entry for other user), check if the user exists
    else if (!(await User.exists({ _id: bodyCl.user }))) throw new AppError(400, 'False user id provided.');
  }
  // if its a guest...
  else bodyCl = cleanBody(req.body, 'user');

  await _createContributionAndSend(res, bodyCl, isGuest);
});

exports.getContribution = catchAsync(async (req, res) => {
  const contribution = await Contribution.findById(req.params.id).populate('user', 'name').populate('project', 'name');
  if (!contribution) throw new AppError(404, 'No contribution found.');

  res.status(200).json({
    status: 'success',
    data: {
      contribution,
    },
  });
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
