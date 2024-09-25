const catchAsync = require('../utils/catchAsync');
const Contribution = require('./../model/contribution');
const Project = require('./../model/project');
const { projectStatsPipeline, resourceStatsPipeline } = require('./aggregationPipelines/statsPipelines');

// Basic stats of the projects
exports.stats = catchAsync(async (req, res) => {
  // projects stats aggregation
  const projects = await Project.aggregate(projectStatsPipeline());

  // resource stats aggregation
  const resList = await Contribution.aggregate(resourceStatsPipeline());

  // the output as stat
  const stats = {
    projects: {
      open: projects[0].proj.open || 0,
      done: projects[0].proj.done || 0,
    },
    resources: resList[0].resources,
  };

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
