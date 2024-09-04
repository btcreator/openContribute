const catchAsync = require('../utils/catchAsync');
const Contribution = require('./../model/contribution');

// Public operations
////
exports.getStats = catchAsync(async (req, res) => {
  //
});

// Contribution GUEST operations
////
exports.getGuestContribution = catchAsync(async (req, res) => {
  //
});

exports.createGuestContribution = catchAsync(async (req, res) => {
  //
});

exports.updateGuestContribution = catchAsync(async (req, res) => {
  // restrict to some resources
});

exports.deleteGuestContribution = catchAsync(async (req, res) => {
  // restrict to some resources
});

// Contribution "MY" operations
////
exports.getMyContribution = catchAsync(async (req, res) => {
  //
});

exports.createMyContribution = catchAsync(async (req, res) => {
  //
});

exports.updateMyContribution = catchAsync(async (req, res) => {
  // restrict to some resources
});

exports.deleteMyContribution = catchAsync(async (req, res) => {
  // restrict to some resources
});

// CRUD operations
////
exports.getContribution = catchAsync(async (req, res) => {
  //
});

exports.createContribution = catchAsync(async (req, res) => {
  //
});

exports.updateContribution = catchAsync(async (req, res) => {
  //
});

exports.deleteContribution = catchAsync(async (req, res) => {
  //
});
