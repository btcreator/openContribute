const mongoose = require('mongoose');
const { removeFiles } = require('./../controller/staticFilesystem/staticFileController');

const feedSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    select: false,
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isMilestone: {
    type: Boolean,
    default: false,
  },
  images: [String],
  videos: [String],
  link: {
    type: String,
    validate: {
      validator: function (link) {
        const reg = /(?<=youtube.com\/watch\?v=)[^&]+/;
        const match = reg.exec(link);
        if (!match) return false;

        this.set('link', `https://www.youtube.com/watch?v=${match[0]}`);
        return true;
      },
      message: 'Link provided is not a vlaid youtube link.',
    },
  },
});

// Hooks (Middlewares)
////
feedSchema.pre('findOneAndDelete', async function (next) {
  const files = await this.clone().findOne().select('images videos -_id');

  files?.images && removeFiles(`./public/feed/img/`, files.images);
  files?.videos && removeFiles(`./public/feed/vid/`, files.videos);

  next();
});

const Feed = mongoose.model('Feed', feedSchema);
module.exports = Feed;
