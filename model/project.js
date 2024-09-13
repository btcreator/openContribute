const mongoose = require('mongoose');
const { excludeSensitiveFields } = require('./../utils/cleanIOdata');
const { removeImages } = require('../controller/staticFilesystem/staticFileController');
const { resources } = require('./resourceDescriptions/resourceDescriptions');

// In mongoose a uniqe index is valid on the collection level, not on subdocuments for example in an array.
// So a custom validator of uniqueness of name fileds are deployed
const uniqueName = function (val) {
  if (!Array.isArray(val)) return false;

  for (let seen = {}, i = 0; i < val.length; ++i) {
    if (seen[val[i].name]) return false;
    seen[val[i].name] = true;
  }
};

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, lowercase: true, required: true },
    summary: {
      type: String,
      required: true,
      maxLength: [160, 'Summary should be not longer than 160 characters. We got {VALUE}.'],
    },
    description: { type: String, required: true },
    locations: {
      type: [
        {
          type: {
            type: String,
            enum: ['Point', 'Just GeoJSON Points are accepted'],
            required: true,
            default: 'Point',
          },
          coordinates: {
            type: [Number],
            required: true,
            validate: {
              validator: function (val) {
                return val.length === 2;
              },
              message: 'False coordinates in location.',
            },
          },
          name: { type: String, required: true },
          _id: false,
        },
      ],
      validate: [uniqueName, 'Duplicate locations are not allowed.'],
    },
    milestones: {
      type: [
        {
          name: { type: String, required: true },
          isDone: { type: Boolean, default: false },
          _id: false,
        },
      ],
      validate: [uniqueName, 'Duplicate milestones are not allowed.'],
    },
    resources: {
      type: [
        {
          name: { type: String, lowercase: true, required: true, enum: resources },
          priority: {
            type: Number,
            required: true,
            min: [1, 'The lowest priority is 1. Got {VALUE}'],
            max: [5, 'The highest priority is 5. Got {VALUE}'],
          },
          auth: { type: Boolean, default: true },
          limit: {
            min: Number,
            max: Number,
          },
          description: String,
          _id: false,
        },
      ],
      validate: [uniqueName, 'Duplicate resources are not allowed.'],
    },
    deadline: { type: Date, default: null },
    coverImg: { type: String, required: true },
    resultImg: { type: String, required: true },
    isDone: { type: Boolean, default: false },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    setInactiveAt: Number,
  },
  {
    toObject: {
      transform: excludeSensitiveFields,
    },
    toJSON: {
      transform: excludeSensitiveFields,
    },
  }
);

// Instance methods
////
projectSchema.methods.rearrangeMilestones = function () {
  // things can change down the road, so let the leader rearrange his milestones when needed. When a milestone is skipped and not the next one
  // gets done first, then need a rearrange of the milestones. [done, done, undone, done, undone] => [done, done, done, undone, undone]
  const undone = [];
  const sortedMilestones = this.milestones
    .filter((milest) => milest.isDone || (undone.push(milest), false))
    .concat(undone);

  // when the last one is done, the project can be marked as done as whole
  sortedMilestones.at(-1).isDone && (this.isDone = true);

  this.milestones = sortedMilestones;
  this.save();
};

// Hooks (Middlewares)
////
projectSchema.pre('findOneAndDelete', async function (next) {
  const images = await this.clone().findOne().select('coverImg resultImg -_id');

  images && removeImages(`./public/img/projects/content/`, Object.values(images.toObject()));

  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
