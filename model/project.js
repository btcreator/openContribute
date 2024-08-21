const mongoose = require('mongoose');
const { excludeSensitiveFields } = require('./../utils/cleanIOdata');

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, lowercase: true, required: true },
    summary: {
      type: String,
      required: true,
      max: [160, 'Summary should be not longer than 160 characters. We got {VALUE}.'],
    },
    description: { type: String, required: true },
    locations: [
      {
        type: {
          type: String,
          enum: ['Point', 'Just GeoJSON Points are accepted'],
          required: true,
        },
        coordinates: { type: [Number], require: true },
      },
    ],
    milestones: [
      {
        name: { type: String, required: true },
        isDone: { type: Boolean, default: false },
      },
    ],
    resources: [
      {
        name: { type: String, required: true },
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
      },
    ],
    deadline: { type: Date, default: null },
    photo: {
      cover: { type: String, required: true },
      result: { type: String, required: true },
    },
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

// Hooks (Middlewares)
////
projectSchema.pre('save', function (next) {
  console.log(this);
  // if milestones are all done, set project to done
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
