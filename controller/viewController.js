const User = require('./../model/user');
const Project = require('./../model/project');
const Contribution = require('./../model/contribution');
const { summaryPipeline } = require('./aggregationPipelines/contributionPipelines');
const { populateContributionsToProjectPipeline } = require('./aggregationPipelines/projectPipelines');
const stat = require('./aggregationPipelines/statsPipelines');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const RefineQuery = require('../utils/refineQuery');

// Alert handler middleware. Passes alert messages to the pug templates
exports.alertMsgHandler = (req, res, next) => {
  if (req.query?.alert) {
    res.locals.alert = req.query.alert;
  }
  if (req.query?.error) {
    res.locals.alert = req.query.error;
    res.locals.alertError = true;
  }
  next();
};

// Home page
exports.getHome = catchAsync(async function (req, res) {
  const projects = (await Project.aggregate(stat.projectStatsPipeline))[0];
  const resList = await Contribution.aggregate(stat.resourceStatsPipeline);
  const contributors = (await Contribution.aggregate(stat.contributorsStatPipeline))[0].contributors;
  const reviews = await User.find({ isActive: true, 'review.review': { $exists: true } })
    .sort('-review.updatedAt')
    .limit(3)
    .select('-_id name photo review');

  const leaders = projects.leaders;
  delete projects.leaders;

  // the output as stat
  const stats = {
    projects: projects,
    resources: resList[0].resources,
    members: {
      contributors,
      leaders,
    },
  };

  res.status(200).render('index', {
    title: 'Where a project come to life.',
    user: req.user,
    stats,
    reviews,
  });
});

// Login page
exports.login = (req, res) => {
  res.status(200).render('signIn', {
    title: 'User Login / Signup',
    user: req.user,
  });
};

// Search page
exports.search = catchAsync(async (req, res) => {
  const selector = 'name slug leader summary type resources resultImg isDone';
  const projectsQuery = Project.find().populate('leader', 'name -_id');

  // search with url query when the search from other page was hit
  const searchText = req.query?.q ?? '';
  const query = new RefineQuery(projectsQuery, { limit: 10, sort: 'createdAt', isDone: false }).refine(
    { isActive: true },
    selector
  );
  const projects = await query.where('name', new RegExp(searchText, 'i'));

  res.status(200).render('search', {
    title: 'Search for project',
    user: req.user,
    searchText,
    projects,
  });
});

// User page
////
// profile details
exports.myProfile = (req, res) => {
  res.status(200).render('user_profile', {
    title: 'My Profile',
    user: req.user,
  });
};

// contributions
exports.myContributions = catchAsync(async (req, res) => {
  const contributions = await Contribution.aggregate(summaryPipeline(req.user._id));

  res.status(200).render('user_contributions', {
    title: 'My Contributions',
    user: req.user,
    contributions,
  });
});

// projects
exports.myProjects = catchAsync(async (req, res) => {
  const projects = await Project.find({ leader: req.user._id, isActive: true }).select(
    'name resultImg progress isDone slug'
  );

  res.status(200).render('user_projects', {
    user: req.user,
    projects,
  });
});

// Project page
////
// show
exports.showProject = catchAsync(async (req, res) => {
  const project = await Project.aggregate(
    populateContributionsToProjectPipeline({ slug: req.params.slug, isActive: true })
  );

  if (!project)
    throw new AppError(
      404,
      'This project was not found. When you are sure this project should exist, please try again or contact us.'
    );

  res.status(200).render('project_detail', {
    title: project.name,
    user: req.user,
    project: project[0],
  });
});

// update
exports.updateMyProject = catchAsync(async (req, res) => {
  const project = await Project.aggregate(
    populateContributionsToProjectPipeline({ slug: req.params.slug, leader: req.user._id, isActive: true })
  );
  if (!project) throw new AppError(404, 'No Project found with your lead');

  res.status(200).render('project_update', {
    title: project[0].name,
    user: req.user,
    project: project[0],
  });
});
