const catchAsync = require('../utils/catchAsync');
const { serverLog } = require('../utils/helpers');
const AppError = require('./../utils/appError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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
  const project = await Project.findOne({ _id: projIdObj, 'resources.name': resourceName, isActive: true });

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
    throw new AppError(422, 'Contribution not accepted, because the max limit of the resource would be exceeded.');

  return project;
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
  await _clarifyResourceAndLimit(project, resource, +amount, isGuest);

  const contribution = await Contribution.create(payload);

  res.status(201).json({
    status: 'success',
    data: {
      contribution,
    },
  });
};

// Create fund contribution
const _createFundContribution = async function (session) {
  const userId = session.metadata.userId;
  const project = session.client_reference_id;
  const amount = session.amount_total / 100;

  const payload = { project, resource: 'funds', amount };
  userId && Object.assign(payload, { user: userId });

  (await Contribution.create(payload)).catch((err) =>
    serverLog(`Fund contribution could not be recorded in the database. Session id: ${session.id} - Error: ${err}`)
  );
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
  // for funds needs to be used aother route
  if (req.body.resource === 'funds')
    throw new AppError(400, "For funds contributions please use the 'fundsContributionSession' route.");

  // initiate most secure values
  let isGuest = true;
  let bodyCl = {};

  // if its an authorized user
  if (req.user) {
    bodyCl = cleanBody(req.body);
    isGuest = false;

    // when an admin and provide a user id (entry for other user), check if the user exists
    if (req.user.role === 'admin' && bodyCl.user) {
      if (!(await User.exists({ _id: bodyCl.user }))) throw new AppError(400, 'False user id provided.');
    }
    // not an admin or when an admin, but not provide a user id (contribute self as user)
    else bodyCl.user = req.user._id;
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

// Payment operation
////
exports.fundsContributionSession = catchAsync(async (req, res) => {
  const isGuest = !req.user;
  const project = await _clarifyResourceAndLimit(req.params.projectId, 'funds', +req.body.amount, isGuest);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    metadata: {
      userId: req.user?.id,
    },
    customer_email: req.user?.email,
    client_reference_id: req.params.projectId,
    success_url: `${req.protocol}://${req.get('host')}/project/${project.slug}?alert="Contribution successful."`,
    cancel_url: `${req.protocol}://${req.get('host')}/project/${project.slug}?error="Contribution cancelled."`,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: project.name,
            description: project.summary,
            images: [`${req.protocol}://${req.get('host')}/media/projects/content/${project.coverImg}`],
          },
          unit_amount: req.body.amount * 100,
        },
        quantity: 1,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});

// Stripe webhook
exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook signature error: ${err.message}`);
  }

  // actually not mandatory if the webhook is listening just on that one event
  if (event.type === 'checkout.session.completed') _createFundContribution(event.data.object);

  res.status(200).json({ received: true });
};
