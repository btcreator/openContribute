const Project = require('./../model/project');
const RefineQuery = require('./../utils/refineQuery');
const catchAsync = require('./../utils/catchAsync');
const { cleanBody } = require('./../utils/cleanIOdata');

// Project "MY" operations
////
exports.myProjects = catchAsync(async (req, res) => {
  const projects = await Project.find({ leader: req.user.id, isActive: true });

  res.status(200).json({
    status: 'success',
    data: {
      projects,
    },
  });
});

exports.createMyProject = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body, 'isActive', 'setInactiveAt', 'isDone');
  req.body.leader = req.user._id;

  const project = await Project.create(bodyCl);

  res.status(200).json({
    status: 'success',
    project,
  });
});

exports.updateMyProject = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body, 'isActive', 'isDone', 'leader');

  let resources = req.body.resources;
  const project = await Project.findOne({ _id: req.param.id, isActive: true });

  if (!project) throw new AppError(404, 'No project found with that id.');
  if (project.leader !== req.user._id) throw new AppError(403, 'You are not the leader of this project.');

  // update resources
  if (resources && Array.isArray(resources)) {
    // convert resources Array to obj
    const resourcesObj = {};
    resources.forEach((el) => (resourcesObj[el.name] = el));

    project.resources = project.resources.map((resrc) => resourcesObj[resrc.name] ?? resrc);
  }

  // update milestones
  // continue

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
  const project = await Project.findById(req.param.id);

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.createProject = catchAsync(async (req, res) => {
  const project = await Project.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.updateProject = catchAsync(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    returnOriginal: false,
  });

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
  if (req.user.role !== 'admin') {
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
