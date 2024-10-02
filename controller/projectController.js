const { ObjectId } = require('mongoose').Types;
const Project = require('./../model/project');
const User = require('./../model/user');
const RefineQuery = require('./../utils/refineQuery');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { cleanBody } = require('./../utils/cleanIOdata');
const { updateImages } = require('./staticFilesystem/staticFileController');
const { description } = require('./../model/resourceDescriptions/resourceDescriptions');
const { populateContributionsToProjectPipeline } = require('./aggregationPipelines/projectPipelines');

// Update project
const _updateProjectById = async function (id, body) {
  // update the project with the new data
  const _id = new ObjectId(`${id}`);
  const updateLog = await Project.updateOne({ _id }, ..._fieldsToUpdateObj(body));

  // no project found
  if (updateLog.acknowledged && !updateLog.matchedCount) throw new AppError(404, 'No project found with that id.');

  // get the updated project
  const project = await Project.findOne({ _id });

  // when no data was sent, the update log acknowledge is false. That do not mean, no project exists with that id. So we need to check it
  if (!project) throw new AppError(404, 'No project found with that id.');

  // if milestones was changed, rearrange those
  if (body.milestones) project.rearrangeMilestones();

  return project;
};

// Convert the body to update object and when array fields are updated, then set the arrayFilters option too for mongo/mongoose updateOne method
const _fieldsToUpdateObj = function (body) {
  const set = {};
  const arrayFilters = [];

  const fields = Object.keys(body);
  fields.forEach((field) => {
    // plain fields are just set with they value
    if (typeof body[field] !== 'object') return (set[field] = body[field]);

    // there are no object fields, so what is not an Array, but an Object, needs to be wrapped in an Array
    if (!Array.isArray(body[field])) body[field] = [body[field]];

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
};

// Public operations
////
// For convenient search results
exports.getSearchResults = catchAsync(async (req, res) => {
  const selector = 'name slug summary leader type resources resultImg isDone';

  const projectsQuery = Project.find().select(selector).populate('leader', 'name -_id');

  const query = new RefineQuery(projectsQuery, req.query).refine({ isActive: true });
  const projects = await query;

  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: {
      projects,
    },
  });
});

// Resource info and description
exports.resourceInfo = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      description,
    },
  });
};

// Project "MY" operations
////
exports.myProjects = catchAsync(async (req, res) => {
  const projects = await Project.find({ leader: req.user._id, isActive: true });

  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: {
      projects,
    },
  });
});

exports.createMyProject = catchAsync(async (req, res) => {
  if (!req.user.name)
    throw new AppError(400, 'To be a leader of a project, we need your name. Please update it in your profile.');

  const bodyCl = cleanBody(req.body, 'isActive', 'setInactiveAt', 'isDone', 'coverImg', 'resultImg');
  bodyCl.leader = req.user._id;

  const images = req.files;
  if (images) {
    bodyCl.coverImg = images.cover?.[0].filename;
    bodyCl.resultImg = images.result?.[0].filename;
  }

  const project = await Project.create(bodyCl);

  res.status(200).json({
    status: 'success',
    project,
  });
});

exports.updateMyProject = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body, 'isActive', 'isDone', 'leader');

  const _id = new ObjectId(`${req.params.id}`);
  if (!(await Project.exists({ _id, leader: req.user._id })))
    throw new AppError(403, 'You are not the leader of this project.');

  const project = await _updateProjectById(req.params.id, bodyCl);

  if (req.files) {
    const imageNames = { cover: project.coverImg, result: project.resultImg };
    await updateImages(req.files, imageNames);
  }

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.deleteMyProject = catchAsync(async (req, res) => {
  const _id = new ObjectId(`${req.params.id}`);
  if (!(await Project.exists({ _id, leader: req.user._id })))
    throw new AppError(403, 'You are not the leader of this project.');

  await Project.findByIdAndUpdate(req.params.id, { isActive: false, setInactiveAt: Date.now() });

  res.status(204).end();
});

// CRUD operations
////
exports.getProject = catchAsync(async (req, res) => {
  const match = {};

  // get project is bound to one of params: id or slug.
  if (req.params.id) match._id = new ObjectId(`${req.params.id}`);
  if (req.params.slug) match.slug = req.params.slug;

  const project = await Project.aggregate(populateContributionsToProjectPipeline(match));

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.createProject = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body);
  const images = req.files;

  if (bodyCl.leader && !(await User.findById(bodyCl.leader, { name: 1 }).exists('name')))
    throw new AppError(400, 'To be a leader of a project, we need the leaders name. Please update it first.');

  if (images) {
    bodyCl.coverImg = images.cover?.filename;
    bodyCl.resultImg = images.result?.filename;
  }

  const project = await Project.create(bodyCl);

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.updateProject = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body);

  const project = await _updateProjectById(req.params.id, bodyCl);

  if (req.files) {
    const imageNames = { cover: project.coverImg, result: project.resultImg };
    await updateImages(req.files, imageNames);
  }

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
  const projectsQuery = Project.find({}).select('+isActive');

  const query = new RefineQuery(projectsQuery, req.query).refine();
  const projects = await query;
  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: {
      projects,
    },
  });
});
