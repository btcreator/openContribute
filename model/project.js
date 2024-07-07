const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  summary: {
    type: String,
    required: true,
    max: [
      160,
      "Summary should be not longer than 160 characters. We got {VALUE}.",
    ],
  },
  description: { type: String, required: true },
  locations: [
    {
      type: {
        type: String,
        enum: ["Point", "Just GeoJSON Points are accepted"],
        required: true,
      },
      coordinates: { type: [Number], require: true },
    },
  ],
  milestones: [String],
  resources: [
    {
      name: { type: String, required: true },
      priority: {
        type: Number,
        required: true,
        min: [1, "The lowest priority is 1. Got {VALUE}"],
        max: [5, "The highest priority is 5. Got {VALUE}"],
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
  feed: { type: mongoose.ObjectId },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
