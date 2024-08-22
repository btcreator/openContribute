const mongoose = require('mongoose');
const Project = require('./../model/project');
const User = require('./../model/user');
const RefineQuery = require('./../utils/refineQuery');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { cleanBody } = require('./../utils/cleanIOdata');

// update array elements - (just update already existed, no new elements get added)
const updateArray = (target, source) => {
  // convert Array to obj
  const sourceObj = {};
  source.forEach((el) => (sourceObj[el.name] = el));

  // merge all elements
  return target.map((el) => sourceObj[el.name] ?? el);
};

// update array fileds
const updateArrayFields = (doc, body, ...fields) => {
  const updatedArrFields = {};

  fields.forEach((field) => {
    if (body[field] && Array.isArray(body[field])) {
      updatedArrFields[field] = updateArray(doc[field], body[field]);
    }
  });

  return updateArrayFields;
};

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

  const _id = new mongoose.Types.ObjectId(`${req.params.id}`);
  const project = await Project.findOne({ _id, isActive: true });

  if (!project) throw new AppError(404, 'No project found with that id.');
  if (project.leader.toString() !== req.user._id.toString())
    throw new AppError(403, 'You are not the leader of this project.');

  // update array fields
  const updatedArrFields = updateArrayFields(project, bodyCl, 'milestones', 'resources');

  // update the document with new data
  Object.assign(project, bodyCl, updatedArrFields);

  // save
  await project.save();

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
  const project = await Project.findById(req.params.id);

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
    throw new AppError(400, 'To be a leader of a project, we need your name. Please update it in your profile.');

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

  const project = await Project.findById(req.params.id).select('+isActive');

  if (!project) throw new AppError(404, 'No project found with that id.');

  // update array fields
  const updatedArrFields = updateArrayFields(project, bodyCl, 'milestones', 'resources');

  // update the document with new data
  Object.assign(project, bodyCl, updatedArrFields);

  // save
  await project.save();

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
  if (req.user?.role !== 'admin') {
    queryObj.isActive = true;
    delete req.query.isActive;
  }

  const projectsQuery = Project.find(queryObj);

  const query = new RefineQuery(projectsQuery, req.query).refine();
  const projects = await query;
  res.status(200).json({
    status: 'success',
    data: {
      projects,
    },
  });
});
