// Return the project with the contributions to the resources and the contributors names
exports.populateContributionsToProjectPipeline = (match) => [
  // stage 1 - match the project by id or slug
  {
    $match: match,
  },
  // stage 2 - populate leader
  {
    $lookup: {
      from: 'users',
      localField: 'leader',
      foreignField: '_id',
      as: 'leader',
      pipeline: [
        {
          $project: { name: 1, _id: 0 },
        },
      ],
    },
  },
  // stage 3 - returned populate is an array. Unwind to get the object with name
  {
    $unwind: '$leader',
  },
  // stage 4 - populate contributions with contributors and resources which belongs to the project
  {
    $lookup: {
      from: 'contributions',
      localField: '_id',
      foreignField: 'project',
      as: 'contributions',
      pipeline: [
        // stage 4.1 - grouping based on user and resource to sum amounts contributed / guest users are collected under id: null
        {
          $group: {
            _id: {
              user: { $ifNull: ['$user', null] },
              resource: '$resource',
            },
            count: { $sum: '$amount' },
          },
        },
        // stage 4.2 - each resource gets a group of total amount and contributor users Set
        {
          $group: {
            _id: '$_id.resource',
            count: { $sum: '$count' },
            contributors: { $addToSet: '$_id.user' },
          },
        },
        // stage 4.3 - prepare for converting resources to object and collect all users Set in an Array
        {
          $group: {
            _id: null,
            resources: { $push: { k: '$_id', v: '$count' } },
            contributors: { $push: '$contributors' },
          },
        },
        // stage 4.4 - convert resources to his final form, and reduce contributor ids to one Set
        {
          $project: {
            resources: { $arrayToObject: '$resources' },
            contributors: {
              $reduce: {
                input: '$contributors',
                initialValue: [],
                in: { $setUnion: ['$$value', '$$this'] },
              },
            },
          },
        },
      ],
    },
  }, // stage 5 - populate contributors with they names as "populatedContributors" / guests (null) gets here excluded
  {
    $lookup: {
      from: 'users',
      localField: 'contributions.contributors',
      foreignField: '_id',
      as: 'populatedContributors',
      pipeline: [{ $project: { _id: 0, name: 1 } }],
    },
  },
  // stage 6 - populated fields are arrays, so unwind it.
  {
    $unwind: '$contributions',
  },
  // stage 7 - add contributors names to the populatedContributors array
  {
    $addFields: {
      populatedContributors: {
        $map: {
          input: '$populatedContributors',
          as: 'user',
          in: '$$user.name',
        },
      },
      leader: '$leader.name',
    },
  },
  // stage 8 - add contributors names to the contributions.contributors array and add guest when needed
  {
    $addFields: {
      'contributions.contributors': {
        $cond: {
          if: {
            $lt: [{ $size: '$populatedContributors' }, { $size: '$contributions.contributors' }],
          },
          then: { $concatArrays: ['$populatedContributors', ['guest']] },
          else: '$populatedContributors',
        },
      },
    },
  },
  // stage 9 - remove unnecessary fields
  {
    $project: {
      populatedContributors: 0,
      _id: 0,
      'contributions._id': 0,
    },
  },
];
