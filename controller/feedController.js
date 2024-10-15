const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const RefineQuery = require('../utils/refineQuery');
const { ObjectId } = require('mongoose').Types;
const { cleanBody } = require('./../utils/cleanIOdata');
const Project = require('./../model/project');
const Feed = require('./../model/feed');
const Contribution = require('./../model/contribution');

exports.getProjectsFeed = catchAsync(async (req, res) => {
  const projectId = new ObjectId(`${req.params.id}`);
  const match = { project: projectId };
  const aContributor = () => Contribution.exists({ user: req.user._id, project: projectId });
  const aLeader = () => Project.exists({ _id: projectId, leader: req.user._id });

  // Return only milestone feeds if the user is not admin and has not contributed to the project, or there is no user (guest)
  if (req.user) {
    if (req.user.role !== 'admin' && !(await aContributor()) && !(await aLeader())) match.isMilestone = true;
  } else match.isMilestone = true;

  const feed = await Feed.find(match).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: {
      feed,
    },
  });
});

// MY Routes
////
exports.createMyFeed = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body);
  bodyCl.images = [];
  bodyCl.videos = [];

  // check if project exists and if the user is the leader
  if (!(await Project.exists({ _id: bodyCl.project, leader: req.user._id })))
    throw new AppError(403, 'You are not allowed to create a feed for this project');

  // if files was uploaded
  req.files?.images && req.files.images.forEach((file) => bodyCl.images.push(file.filename));
  req.files?.videos && req.files.videos.forEach((file) => bodyCl.videos.push(file.filename));

  // add the leader to the body
  bodyCl.leader = req.user._id;
  const feed = await Feed.create(bodyCl);

  res.status(201).json({
    status: 'success',
    data: {
      feed,
    },
  });
});

exports.updateMyFeed = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body, 'leader', 'project');
  const _id = new ObjectId(`${req.params.id}`);
  const maxImg = process.env.FEED_MAX_IMAGE_ALLOWED;
  const maxVid = process.env.FEED_MAX_VIDEO_ALLOWED;

  const feed = await Feed.findOne({ _id, leader: req.user._id });
  if (!feed) throw new AppError(403, 'You are not allowed to update this feed');

  // if files was uploaded, update feed directly
  if (req.files?.images) {
    if (req.files.images.length + feed.images.length > maxImg)
      throw new AppError(
        400,
        `Just ${maxImg} images per feed are allowed. ${feed.images.length} is/are already present.`
      );
    req.files.images.forEach((file) => feed.images.push(file.filename));
  }
  if (req.files?.videos) {
    if (req.files.videos.length + feed.videos.length > maxVid)
      throw new AppError(
        400,
        `Just ${maxVid} videos per feed are allowed. ${feed.videos.length} is/are already present.`
      );
    req.files.videos.forEach((file) => feed.videos.push(file.filename));
  }

  // update fields in feed
  feed.set(bodyCl);
  await feed.save();

  res.status(200).json({
    status: 'success',
    data: {
      feed,
    },
  });
});

exports.deleteMyFeed = catchAsync(async (req, res) => {
  const _id = new ObjectId(`${req.params.id}`);
  await Feed.findOneAndDelete({ _id, leader: req.user._id });

  res.status(204).end();
});

// CRUD operations
////
exports.createFeed = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body);
  const _id = new ObjectId(`${bodyCl.project}`);
  const leader = new ObjectId(`${bodyCl.leader}`);
  bodyCl.images = [];
  bodyCl.videos = [];

  // check if project exists and if the leader is the leader
  if (!(await Project.exists({ _id, leader })))
    throw new AppError(403, 'Leader provided does not match the projects leader');

  // if files was uploaded
  req.files?.images && req.files.images.forEach((file) => bodyCl.images.push(file.filename));
  req.files?.videos && req.files.videos.forEach((file) => bodyCl.videos.push(file.filename));

  const feed = await Feed.create(bodyCl);

  res.status(201).json({
    status: 'success',
    data: {
      feed,
    },
  });
});

exports.updateFeed = catchAsync(async (req, res) => {
  const bodyCl = cleanBody(req.body, 'leader', 'project');
  const maxImg = process.env.FEED_MAX_IMAGE_ALLOWED;
  const maxVid = process.env.FEED_MAX_VIDEO_ALLOWED;

  // search for feed
  const feed = await Feed.findById(req.params.id);
  if (!feed) throw new AppError(404, 'No feed with provided id found.');

  // if files was uploaded, update feed directly
  if (req.files?.images) {
    if (req.files.images.length + feed.images.length > maxImg)
      throw new AppError(
        400,
        `Just ${maxImg} images per feed are allowed. ${feed.images.length} is/are already present.`
      );
    req.files.images.forEach((file) => feed.images.push(file.filename));
  }
  if (req.files?.videos) {
    if (req.files.videos.length + feed.videos.length > maxVid)
      throw new AppError(
        400,
        `Just ${maxVid} videos per feed are allowed. ${feed.videos.length} is/are already present.`
      );
    req.files.videos.forEach((file) => feed.videos.push(file.filename));
  }

  // update fields in feed
  feed.set(bodyCl);
  feed.save();

  res.status(200).json({
    status: 'success',
    data: {
      feed,
    },
  });
});

exports.deleteFeed = catchAsync(async (req, res) => {
  await Feed.findByIdAndDelete(req.params.id);

  res.status(204).end();
});

exports.getAllFeed = catchAsync(async (req, res) => {
  const feedQuery = Feed.find({}).select('+project');

  const query = new RefineQuery(feedQuery, req.query).refine();
  const feeds = await query;

  res.status(200).json({
    status: 'success',
    results: feeds.length,
    data: {
      feeds,
    },
  });
});

// Remove Image(s) / remove video(s) route
exports.removeFiles = catchAsync(async (req, res) => {
  // when one file was passed as string, wrap it in Array, when more files are passed, copy reference. Else empty Array
  const images =
    typeof req.body?.images === 'string' ? [req.body.images] : Array.isArray(req.body?.images) ? req.body.images : [];
  const videos =
    typeof req.body?.videos === 'string' ? [req.body.videos] : Array.isArray(req.body?.videos) ? req.body.videos : [];
  const removed = {
    images: [],
    videos: [],
  };

  // need user id to check if the leader who try to remove - after authenticate
  // get the feed  - need id - :id
  const _id = new ObjectId(`${req.params.id}`);
  const feed = await Feed.findOne({ _id, leader: req.user._id }).select('images videos');
  if (!feed) throw new AppError(403, "You are not the leader. Can't perform file removal.");

  // look in the feed if the files are there, then remove them
  if (images.length > 0 && feed.images) {
    images.forEach((file) => {
      const index = feed.images.indexOf(file);
      index > -1 && (feed.images.splice(index, 1), removed.images.push(file));
    });
  }
  if (videos.length > 0 && feed.videos) {
    videos.forEach((file) => {
      const index = feed.videos.indexOf(file);
      index > -1 && (feed.videos.splice(index, 1), removed.videos.push(file));
    });
  }

  // just the found filenames gets removed from the disk
  feed.$locals.filesRemoved = removed;
  await feed.save();

  res.status(204).end();
});
