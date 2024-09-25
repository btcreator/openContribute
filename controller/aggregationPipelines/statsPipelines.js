// Return the stats of the projects which are done or open
exports.projectStatsPipeline = () => [
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
];

// Return the stats of the resources how much was contributed to them
exports.resourceStatsPipeline = () => [
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
];
