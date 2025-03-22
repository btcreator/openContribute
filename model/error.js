const mongoose = require('mongoose');

const errorStackSchema = new mongoose.Schema(
  {
    error: {
      type: Object,
      required: [true, 'Error object is required'],
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

const ErrorStack = mongoose.model('ErrorStack', errorStackSchema);

module.exports = ErrorStack;
