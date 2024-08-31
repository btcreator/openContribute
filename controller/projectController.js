const { ObjectId } = require('mongoose').Types;
const Project = require('./../model/project');
const User = require('./../model/user');
const RefineQuery = require('./../utils/refineQuery');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { cleanBody } = require('./../utils/cleanIOdata');

// Update project 
const updateProjectById = async function(id, body) {
  // update the project with the new data
  const _id = new ObjectId(`${id}`);
  const updateLog = await Project.updateOne({ _id }, ...fieldsToUpdateObj(body));

  // no project found
  if (!updateLog.matchedCount) throw new AppError(404, 'No project found with that id.');

  // if milestones was changed, rearrange those
  const project = await Project.findOne({ _id });
  if(body.milestones) project.rearrangeMilestones();

  return project;
};

// Convert the body to update object and when array fields are updated too, then set the arrayFilters option too for mongo/mongoose updateOne method
const fieldsToUpdateObj = function(body) {
  const set = {};
  const arrayFilters = [];

  const fields = Object.keys(body);
  fields.forEach((field) => {
    // plain fields are just set with they value
    if (!Array.isArray(body[field])) return (set[field] = body[field]);

    // array fields contains objects
    body[field].forEach((obj, i) => {
      // in those objects the properties/keys gets updated
      Object.keys(obj).forEach((key) => {
        // the "name" is the unique key identifier
        if (key !== 'name')
          // the to-update keys are set with the "$[${field}${i}]" identifier which would be the unique filter for each object
          set[`${field}.$[${field}${i}].${key}`] = body[field][i][key];
        // the name property is used to filter out which properties should be updated in that ONE particular object. One, because name is unique, so no property in other objects get updated.
        else
          arrayFilters.push({
            [`${field}${i}.${key}`]: body[field][i][key],
          });
      });
    });
  });

  return [{ $set: set }, { arrayFilters }];
}

// Project "MY" operations
////
exports.myProjects = catchAsync(async (req, res) => {
  const projects = await Project.find({ leader: req.user.id, isActive: true }).populate('leader');

  res.status(200).json({
    status: 'success',
    data: {
      projects,
    },
  });
});

exports.createMyProject = catchAsync(async (req, res) => {
  if (!req.user.name)
    throw new AppError(400, 'To be a leader of a project, we need your name. Please update it in your profile.');

  const bodyCl = cleanBody(req.body, 'isActive', 'setInactiveAt', 'isDone');
  bodyCl.leader = req.user._id;

  const project = await Project.create(bodyCl);

  res.status(200).json({
    status: 'success',
    project,
  });
});

exports.updateMyProject = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body, 'isActive', 'isDone', 'leader');

  const project = await updateProjectById(req.params.id, bodyCl);

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.deleteMyProject = catchAsync(async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, { isActive: false, setInactiveAt: Date.now() });

  res.status(204).end();
});

// CRUD operations
////
exports.getProject = catchAsync(async (req, res) => {
  const project = await Project.findById(req.params.id).populate("leader");

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.createProject = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body);

  if (bodyCl.leader && !(await User.findById(bodyCl.leader, { name: 1 }).exists('name')))
    throw new AppError(400, 'To be a leader of a project, we need the leaders name. Please update it first.');

  const project = await Project.create(bodyCl);

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.updateProject = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body, 'leader');
  
  const project = await updateProjectById(req.params.id, bodyCl);

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.deleteProject = catchAsync(async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);

  res.status(204).end();
});

// get all projects - serach with query
exports.getAllProjects = catchAsync(async (req, res) => {
  // users cant search or query for inactive projects, just admins
  const queryObj = {};
  let selector = '';
  if (req.user?.role !== 'admin') {
    queryObj.isActive = true;
    delete req.query.isActive;
  } else {
    selector = '+isActive';
  }

  const projectsQuery = Project.find(queryObj).select(selector);

  const query = new RefineQuery(projectsQuery, req.query).refine();
  const projects = await query;
  res.status(200).json({
    status: 'success',
    data: {
      projects,
    },
  });
});
