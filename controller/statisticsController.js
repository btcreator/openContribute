const catchAsync = require('../utils/catchAsync');
const Contribution = require('./../model/contribution');
const Project = require('./../model/project');
const {
  projectStatsPipeline,
  resourceStatsPipeline,
  contributorsStatPipeline,
} = require('./aggregationPipelines/statsPipelines');

// Basic stats of the projects
exports.stats = catchAsync(async (req, res) => {
  // projects stats aggregation - about open / already done projects and amount of leaders
  const projects = await Project.aggregate(projectStatsPipeline);
  const leaders = projects.leaders;
  delete projects.leaders;

  // resource stats aggregation - about how many of each resources was contributed
  const resList = await Contribution.aggregate(resourceStatsPipeline);

  // contributors stat aggregation - about how many people contributed to all projects
  const contributors = await Contribution.aggregate(contributorsStatPipeline);

  // the output as stat
  const stats = {
    projects: projects[0],
    resources: resList[0].resources,
    members: {
      contributors,
      leaders,
    },
  };

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
