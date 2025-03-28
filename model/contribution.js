const mongoose = require('mongoose');
const crypto = require('crypto');
const { resources } = require('./resourceDescriptions/resourceDescriptions');
const { projectsContributorsPipeline } = require('../controller/aggregationPipelines/contributionPipelines');

const contributionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Need a project to which the resource is contributed.'],
  },
  resource: {
    type: String,
    lowercase: true,
    required: [true, 'Please provide with which resource you want to contribute.'],
    enum: resources,
  },
  amount: {
    type: Number,
  },
  contributedAt: {
    type: Date,
    default: Date.now,
  },
  guestPassToken: {
    type: String,
    select: false,
    unique: true,
    validate: {
      validator: (token) => token.length === 64,
      message: 'Invalid pass token.',
    },
  },
});

// Indexing
////
contributionSchema.index({ user: 1 });
contributionSchema.index({ project: 1 });
contributionSchema.index({ project: 1, resource: 1 });

// Hooks (Middlewares)
////
contributionSchema.pre('save', function (next) {
  if (!this.isNew || this.user) return next();

  this.guestPassToken = crypto.randomBytes(32).toString('hex');

  next();
});

const contribution = mongoose.model('Contribution', contributionSchema);

module.exports = contribution;
