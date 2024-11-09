const User = require('./../model/user');
const Project = require('./../model/project');
const Contribution = require('./../model/contribution');
const { summaryPipeline } = require('./aggregationPipelines/contributionPipelines');
const stat = require('./aggregationPipelines/statsPipelines');
const catchAsync = require('./../utils/catchAsync');

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
    alert: req.query?.alert,
  });
});

exports.login = (req, res) => {
  res.status(200).render('signIn', {
    title: 'User Login / Signup',
    user: req.user,
    alert: req.query?.alert,
  });
};

exports.myProfile = (req, res) => {
  res.status(200).render('user_profile', {
    title: 'My Profile',
    user: req.user,
  });
};

exports.myContributions = catchAsync(async (req, res) => {
  const contributions = await Contribution.aggregate(summaryPipeline(req.user._id));

  res.status(200).render('user_contributions', {
    title: 'My Contributions',
    user: req.user,
    contributions,
  });
});

exports.myProjects = catchAsync(async (req, res) => {
  const projects = await Project.find({ leader: req.user._id, isActive: true }).select(
    'name resultImg progress isDone slug'
  );

  res.status(200).render('user_projects', {
    user: req.user,
    projects,
  });
});
