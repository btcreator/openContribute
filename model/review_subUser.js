const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    _id: false,
    review: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: false,
      updatedAt: true,
    },
  }
);

reviewSchema.pre('validate', function (next) {
  if (this.review === '') this.review = undefined;
  next();
});

module.exports = reviewSchema;
