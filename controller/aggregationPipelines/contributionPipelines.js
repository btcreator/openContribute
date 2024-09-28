// Return the contributions summary of the user
exports.summaryPipeline = (user) => [
  // stage 1 - match all contributions from the logged in user
  {
    $match: { user },
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
];

// Return the contributions to the resource
exports.resourcePipeline = (project, resource) => [
  {
    $match: {
      project,
      resource,
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
];

exports.projectsContributorsPipeline = (project) => [
  {
    $match: { project },
  },
  {
    $group: {
      _id: { $ifNull: ['$user', null] },
    },
  },
  {
    $group: {
      _id: null,
      users: { $push: '$_id' },
    },
  },
  {
    $lookup: {
      from: 'users',
      localField: 'users',
      foreignField: '_id',
      as: 'contributors',
      pipeline: [
        {
          $project: { name: { $ifNull: ['$name', 'Anonymous'] }, photo: 1, _id: 0 },
        },
      ],
    },
  },
  {
    $addFields: {
      contributors: {
        $cond: {
          if: {
            $lt: [{ $size: '$contributors' }, { $size: '$users' }],
          },
          then: { $concatArrays: ['$contributors', [{ name: 'Guest', photo: 'default.jpg' }]] },
          else: '$contributors',
        },
      },
    },
  },
  {
    $project: {
      users: 0,
      _id: 0,
    },
  },
];
