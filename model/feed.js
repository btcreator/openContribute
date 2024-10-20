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

// Indexing
////
feedSchema.index({ project: 1 });

// Hooks (Middlewares)
////
feedSchema.pre('findOneAndDelete', async function () {
  const files = await this.clone().findOne().select('images videos -_id');

  files?.images && removeFiles(`./public/feed/img/`, files.images);
  files?.videos && removeFiles(`./public/feed/vid/`, files.videos);
});

// save the state of modification for post hook
feedSchema.pre('save', function (next) {
  if (this.isModified('images videos')) this.$locals.filesModified = true;

  next();
});

// when modification was made, and files was removed, then the hook is triggered from file removal route
feedSchema.post('save', function (doc, next) {
  if (doc.$locals.filesModified && doc.$locals?.filesRemoved) {
    removeFiles(`./public/feed/img/`, doc.$locals.filesRemoved.images);
    removeFiles(`./public/feed/vid/`, doc.$locals.filesRemoved.videos);
  }

  next();
});

const Feed = mongoose.model('Feed', feedSchema);
module.exports = Feed;
