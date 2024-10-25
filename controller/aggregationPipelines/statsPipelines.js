// Return the stats of the projects which are done or open
exports.projectStatsPipeline = [
  // stage 1 - each document gets controlled
  {
    $match: {},
  },
  // stage 2 - grouping based on leaders, and how many open and done projects they have
  {
    $group: {
      _id: '$leader',
      done: {
        $sum: {
          $cond: {
            if: '$isDone',
            then: 1,
            else: 0,
          },
        },
      },
      open: {
        $sum: {
          $cond: {
            if: { $and: [{ $not: '$isDone' }, '$isActive'] },
            then: 1,
            else: 0,
          },
        },
      },
    },
  },
  // stage 3 - count leaders, and sum they done/open projects
  {
    $group: {
      _id: 'null',
      leaders: { $sum: 1 },
      done: { $sum: '$done' },
      open: { $sum: '$open' },
    },
  },
  // stage 4 - remove unnecessary field
  {
    $project: {
      _id: 0,
    },
  },
];

// Return the stats of the resources how much was contributed to them
exports.resourceStatsPipeline = [
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

exports.contributorsStatPipeline = [
  // stage 1 - each document gets controlled
  {
    $match: {},
  },
  // stage 2 - grouping based on user aka. contributor - guests are counted too (null)
  {
    $group: {
      _id: '$user',
    },
  },
  // stage 3 - group them together and count the documents, i.e. all unique users (with guests)
  {
    $group: {
      _id: null,
      contributors: {
        $sum: 1,
      },
    },
  },
  // stage 4 - project fields
  {
    $project: {
      _id: 0,
      contributors: 1,
    },
  },
];

/*
resourceStatsPipeline and contributorsStatPipeleine could be merged together and get with one call,
but it is less performant (more memory usage, and more burden for mongo server because of multiple group and unwind operations)
[{
    $match: {}
  },
  {
    $group: {
      _id: {
        resource: "$resource",
        user: "$user"
      },
      count: {
        $sum: "$amount"
      }
    }
  },
  {
    $group: {
      _id: "$_id.user",
      resourceArr: {
        $push: {
          res: "$_id.resource",
          count: "$count"
        }
      }
    }
  },
  {
    $group: {
      _id: null,
      users: {
        $sum: 1
      },
      resources: {
        "$push": "$resourceArr"
      }
    }
  },
  {
    "$unwind": "$resources"
  },
  {
    $unwind: "$resources"
  },
  {
    $group: {
      _id: "$resources.res",
      count: {
        $sum: "$resources.count"
      },
      contributors: {
        "$first": "$users"
      }
    }
  },
  {
    $group: {
      _id: null,
      resources: {
        $push: {
          k: "$_id",
          v: "$count"
        }
      },
      contributors: {
        $first: "$contributors"
      }
    }
  },
  {
    $project: {
      _id: 0,
      contributors: 1,
      resources: {
        $arrayToObject: "$resources"
      }
    }
  }
] */
