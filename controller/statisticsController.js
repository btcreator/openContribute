const catchAsync = require('../utils/catchAsync');
const Contribution = require('./../model/contribution');
const Project = require('./../model/project');

// Basic stats of the projects
exports.stats = catchAsync(async (req, res) => {
  // projects stats aggregation
  const projects = await Project.aggregate([
    // stage 1 - each document gets controlled
    {
      $match: {},
    },
    // stage 2 - grouping in 4 docs - done and active(removed or not) are booleans
    {
      $group: {
        _id: {
          done: '$isDone',
          active: '$isActive',
        },
        count: {
          $sum: 1,
        },
      },
    },
    // stage 3 - grouping all done projects and all active undone projects
    {
      $group: {
        _id: {
          $cond: {
            if: { $eq: ['$_id.done', true] },
            then: 'done',
            else: {
              $cond: {
                if: { $eq: ['$_id.active', true] },
                then: 'open',
                else: null,
              },
            },
          },
        },
        count: { $sum: '$count' },
      },
    },
    // stage 4 - undone and inactive projects are ignored (projects was removed before done)
    {
      $match: {
        _id: { $ne: null },
      },
    },
    // stage 5 - prepare for convert to object
    {
      $group: {
        _id: null,
        proj: {
          $push: {
            k: '$_id',
            v: '$count',
          },
        },
      },
    },
    // stage 6 - convert result to object
    {
      $project: {
        _id: 0,
        proj: {
          $arrayToObject: '$proj',
        },
      },
    },
  ]);

  // resource stats aggregation
  const resList = await Contribution.aggregate([
    // stage 1 - each document gets controlled
    {
      $match: {},
    },
    // stage 2 - group each resource together and sum the contributed amount
    {
      $group: {
        _id: '$resource',
        count: { $sum: '$amount' },
      },
    },
    // stage 3 - prepare to convert to object
    {
      $group: {
        _id: null,
        resources: {
          $push: {
            k: '$_id',
            v: '$count',
          },
        },
      },
    },
    // stage 4 - output as object with each resource as property
    {
      $project: {
        _id: 0,
        resources: {
          $arrayToObject: '$resources',
        },
      },
    },
  ]);

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
