const mongoose = require('mongoose');
const slugify = require('slugify');
const { excludeSensitiveFields } = require('./../utils/cleanIOdata');
const { removeFiles } = require('../controller/staticFilesystem/staticFileController');
const { resources } = require('./resourceDescriptions/resourceDescriptions');

// In mongoose a uniqe index is valid on the collection level, not on subdocuments for example in an array.
// So a custom validator of uniqueness of name fileds are deployed
const _uniqueName = function (val) {
  if (!Array.isArray(val)) return false;

  for (let seen = {}, i = 0; i < val.length; ++i) {
    if (seen[val[i].name]) return false;
    seen[val[i].name] = true;
  }
};

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, lowercase: true, required: true, trim: true },
    summary: {
      type: String,
      required: true,
      maxLength: [160, 'Summary should be not longer than 160 characters. We got {VALUE}.'],
      trim: true,
    },
    description: { type: String, required: true, trim: true },
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
          name: { type: String, required: true, trim: true },
          _id: false,
        },
      ],
      validate: [_uniqueName, 'Duplicate locations are not allowed.'],
    },
    milestones: {
      type: [
        {
          name: { type: String, required: true, trim: true },
          isDone: { type: Boolean, default: false },
          _id: false,
        },
      ],
      validate: [_uniqueName, 'Duplicate milestones are not allowed.'],
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
          description: {
            type: String,
            trim: true,
          },
          _id: false,
        },
      ],
      validate: [_uniqueName, 'Duplicate resources are not allowed.'],
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
projectSchema.pre(/.*update.*|save/i, function (next) {
  // add slug or update slug. This middleware gets called with document or query. When isModified method exists, its a document and the slug is added. Else the slug must be set to update query.
  if (this.isModified) this.isModified('name') && (this.slug = slugify(this.name, { lower: true }));
  else {
    const prName = this.getUpdate()?.$set?.name;
    prName && this.set('slug', slugify(prName, { lower: true }));
  }
  next();
});

projectSchema.pre('findOneAndDelete', async function () {
  const images = await this.clone().findOne().select('coverImg resultImg -_id');

  images && removeFiles(`./public/img/projects/content/`, Object.values(images.toObject()));
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
