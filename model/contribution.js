const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'project',
    required: [true, 'Need a project to which the resource is contributed.'],
  },
  resource: {
    type: String,
    lowercase: true,
    required: [true, 'Please provide with which resource you want to contribute.'],
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
    validate: {
      validator: (token) => token.length === 36,
      message: 'Invalid pass token.',
    },
  },
});

const contribution = mongoose.model('Contribution', contributionSchema);

module.exports = contribution;
