// Return the contributions summary of the user
exports.summaryPipeline = (user) => [
  // stage 1 - match all contributions from the user
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
  // stage 5 - populate the projects id and select needed fields
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
            resultImg: 1,
            isDone: 1,
            progress: 1,
            _id: 0,
          },
        },
      ],
    },
  },
  // stage 6 - the populated project is an array, so unwind it (to objects)
  {
    $unwind: {
      path: '$project',
      preserveNullAndEmptyArrays: true,
    },
  },
  // stage 7 - add projects fields direct to the result object - removed projects are threated as removed.
  {
    $addFields: {
      name: { $ifNull: ['$project.name', 'Removed Project'] },
      resultImg: { $ifNull: ['$project.resultImg', 'default_result.jpg'] },
      isDone: { $ifNull: ['$project.isDone', false] },
      progress: { $ifNull: ['$project.progress', 0] },
    },
  },
  // stage 8 - remove project field
  {
    $project: {
      project: 0,
    },
  },
];

// Return the contributions to the resource
exports.resourcePipeline = (project, resource) => [
  // stage 1 - match contributions to the project with that one resource
  {
    $match: {
      project,
      resource,
    },
  },
  // stage 2 - group them together and sum all amounts
  {
    $group: {
      _id: '$project',
      amount: {
        $sum: '$amount',
      },
    },
  },
];

// Gather all contributors of one project
exports.projectsContributorsPipeline = (project) => [
  // stage 1 - find all contributions to the project
  {
    $match: { project },
  },
  // stage 2 - group them based on user (for guest contributions use null)
  {
    $group: {
      _id: { $ifNull: ['$user', null] },
    },
  },
  // stage 3 - put the users id's in one array
  {
    $group: {
      _id: null,
      users: { $push: '$_id' },
    },
  },
  // stage 4 - populate each user id with they names and photo. Users who dont provided they names are Anonymous. Guests are here ignored.
  {
    $lookup: {
      from: 'users',
      localField: 'users',
      foreignField: '_id',
      as: 'contributors',
      pipeline: [
        {
          $project: { name: { $ifNull: ['$name', 'Anonymous'] }, photo: 1, alias: 1, _id: 1 },
        },
      ],
    },
  },
  // stage 5 - when before lookup(users) and after lookup(contributors) arrays are not the same length, then there was guest contributors too, so add them back to contributors.
  {
    $addFields: {
      contributors: {
        $cond: {
          if: {
            $lt: [{ $size: '$contributors' }, { $size: '$users' }],
          },
          then: { $concatArrays: ['$contributors', [{ photo: 'default.jpg', name: 'Guest', alias: 'Guest' }]] },
          else: '$contributors',
        },
      },
    },
  },
  // stage 6 - remove unnecessary fields
  {
    $project: {
      users: 0,
      _id: 0,
    },
  },
];
