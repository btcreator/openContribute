const Project = require('./../model/project');
const RefineQuery = require('./../utils/refineQuery');
const catchAsync = require('./../utils/catchAsync');

// Public routes
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

exports.getAllProjects = catchAsync(async (req, res) => {
  const projectsQuery = Project.find({});

  const query = new RefineQuery(projectsQuery, req.query).refine();
  const projects = await query;
  res.status(200).json({
    status: 'success',
    data: {
      projects,
    },
  });
});

// Project "MY" operations
////
exports.myProjects = catchAsync(async (req, res) => {
  const projects = await Project.find({ leader: req.user.id });

  res.status(200).json({
    status: 'success',
    data: {
      projects,
    },
  });
});

exports.createMyProject = catchAsync(async (req, res) => {
  const project = await Project.create(req.body);

  res.status(200).json({
    status: 'success',
    project,
  });
});

exports.updateMyProject = catchAsync(async (req, res) => {
  let resources = req.body.resources;
  const project = await Project.findById(req.param.id);

  if (resources && Array.isArray(resources)) {
    // convert resources Array to obj
    const resourcesObj = {};
    resources.forEach((el) => (resourcesObj[el.name] = el));

    project.resources = project.resources.map((resrc) => resourcesObj[resrc.name] ?? resrc);
  }

  await project.save();

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.deleteMyProject = catchAsync(async (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Route not yet implemented.',
  });
});

// CRUD operations
////
