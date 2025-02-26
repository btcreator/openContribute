const { ObjectId } = require('mongoose').Types;
const Project = require('./../model/project');
const User = require('./../model/user');
const RefineQuery = require('./../utils/refineQuery');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { cleanBody } = require('./../utils/cleanIOdata');
const { updateFilesOnDisk, removeFiles } = require('./staticFilesystem/staticFileController');
const { description } = require('./../model/resourceDescriptions/resourceDescriptions');
const { populateContributionsToProjectPipeline } = require('./aggregationPipelines/projectPipelines');
const { createGeoQuery } = require('./geoQuery/geoQuery');

const _updateProject = async function (queryStr, body, files) {
  const project = await Project.findOne(queryStr);

  if (!project) return project;

  const filesRenameFrom = {};
  const filesRenameTo = {};

  const milest = {};
  if (files?.milestones_img) files.milestones_img.forEach((file) => (milest[file.originalname] = file));

  const fields = Object.keys(body);
  fields.forEach((field) => {
    // plain fields are just set with they value
    if (typeof body[field] !== 'object') return project.set(field, body[field]);

    // there are no object fields, so what is not an Array, but an Object, needs to be wrapped in an Array
    if (!Array.isArray(body[field])) body[field] = [body[field]];

    // convert obj
    const bField = body[field].reduce((acc, obj) => {
      acc[obj.name] = obj;
      return acc;
    }, {});

    project[field]?.forEach((obj) => {
      // {name: ..., isDone: ..., img: ... }
      if (bField[obj.name]) {
        const toUpd = bField[obj.name];
        Object.keys(toUpd).forEach((key, i) => {
          // name, isDone, img
          if (key === 'img' && field === 'milestones') {
            if (obj[key] === 'default.jpg') obj[key] = milest[toUpd[key]].filename;
            else {
              filesRenameFrom[`${field}${i}`] = milest[toUpd[key]];
              filesRenameTo[`${field}${i}`] = obj[key];
            }
            delete milest[toUpd[key]];
          } else obj[key] = toUpd[key];
        });
      }
    });
  });

  if (files?.milestones_img)
    removeFiles(
      './public/media/projects/milestones/',
      Object.values(milest).map((file) => file.filename)
    );

  await updateFilesOnDisk(filesRenameFrom, filesRenameTo);

  return project.save();
};

// Public operations
////
// For convenient search results
exports.getSearchResults = catchAsync(async (req, res) => {
  const selector = 'name slug leader summary type resources resultImg isDone';
  const projectsQuery = Project.find().populate('leader', 'name -_id');
  const filter = { isActive: true };

  // if the location cookie was set, and the same address is passed, the location of the address dont need to fetch again in createGeoQuery
  const lastLoc = req.cookies?.searchLocation ?? null;
  const sameAddr = lastLoc?.address ? req.query?.address === lastLoc.address : false;
  // locationData gets mutated when the address are not the same
  const locationData = sameAddr ? { lastLoc: lastLoc.location } : {};

  // geo-localization
  const { center, distance, unit, address } = req.query;
  const geoQuery = await createGeoQuery(center, distance, unit, address, locationData);

  Object.assign(filter, geoQuery);

  // set cookie on response when different address and when locationData was mutated (new location was added - user can send different address, but send a center with distance too - in this fall no new address location gets added).
  !sameAddr && locationData.lastLoc && res.cookie('searchLocation', { address, location: locationData.lastLoc });

  // remove geo location query elements or the search gets filtered based on them too and no entry gets found
  delete req.query.distance;
  delete req.query.address;
  delete req.query.center;
  delete req.query.unit;

  // searched text is converted as regex for more flexible search results
  const query = new RefineQuery(projectsQuery, req.query).refine(filter, selector);
  const projects = await query.where('name', new RegExp(query.getQuery().name, 'i'));

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

  const bodyCl = cleanBody(req.body, 'isActive', 'setInactiveAt', 'isDone');
  bodyCl.leader = req.user._id;

  const images = req.files;
  const milest = {};
  if (images) {
    bodyCl.coverImg = images.cover?.[0].filename;
    bodyCl.resultImg = images.result?.[0].filename;

    // convert file names for better performance
    if (images.milestones_img) images.milestones_img.forEach((file) => (milest[file.originalname] = file.filename));
  }

  // when user set a name for the milestone, it gets the uploaded name, when no file can be identified with the original name, the default is used (undefined removes the field)
  bodyCl.milestones?.forEach((milestone) => {
    if (milestone.img) {
      const oldName = milestone.img;
      milestone.img = milest[milestone.img];
      delete milest[oldName];
    }
  });

  // Make sure no unwanted files are left on server
  const restFiles = Object.values(milest);
  if (restFiles.length > 0) removeFiles('./public/media/projects/milestones/', restFiles);

  const project = await Project.create(bodyCl);
  await project.rearrangeMilestones();

  res.status(201).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.updateMyProject = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body, 'isActive', 'isDone', 'leader');
  const _id = new ObjectId(`${req.params.id}`);
  const leader = new ObjectId(`${req.user._id}`);
  const project = await _updateProject({ _id, leader }, bodyCl, req.files);

  if (!project) throw new AppError(404, 'No Project found with your lead');

  if (req.files) {
    const imageNames = { cover: project.coverImg, result: project.resultImg };
    await updateFilesOnDisk(req.files, imageNames);
  }

  await project.rearrangeMilestones();

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
  const match = { isActive: true };

  // get project is bound to one of params: id or slug.
  if (req.params.id) match._id = new ObjectId(`${req.params.id}`);
  if (req.params.slug) match.slug = req.params.slug;

  const project = (await Project.aggregate(populateContributionsToProjectPipeline(match)))[0];
  if (!project) throw new AppError(404, 'No project found.');

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
  const milest = {};

  if (bodyCl.leader && !(await User.findById(bodyCl.leader, { name: 1 }).exists('name')))
    throw new AppError(400, 'To be a leader of a project, we need the leaders name. Please update it first.');

  if (images) {
    bodyCl.coverImg = images.cover?.[0].filename;
    bodyCl.resultImg = images.result?.[0].filename;

    // convert file names for better performance
    if (images.milestones_img) images.milestones_img.forEach((file) => (milest[file.originalname] = file.filename));
  }

  // when user set a name for the milestone, it gets the uploaded name, when no file can be identified with the original name, the default is used (undefined removes the field)
  bodyCl.milestones?.forEach((milestone) => {
    if (milestone.img) {
      const oldName = milestone.img;
      milestone.img = milest[milestone.img];
      delete milest[oldName];
    }
  });

  // Make sure no unwanted files are left on server
  const restFiles = Object.values(milest);
  if (restFiles.length > 0) removeFiles('./public/media/projects/milestones/', restFiles);

  const project = await Project.create(bodyCl);
  await project.rearrangeMilestones();

  res.status(200).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.updateProject = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body);
  const _id = new ObjectId(`${req.params.id}`);
  const project = await _updateProject({ _id }, bodyCl, req.files);

  if (req.files) {
    const imageNames = { cover: project.coverImg, result: project.resultImg };
    await updateFilesOnDisk(req.files, imageNames);
  }

  if (project) await project.rearrangeMilestones();

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
