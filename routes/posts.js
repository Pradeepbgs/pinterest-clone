const mongoose = require('mongoose');

// Define the Post schema
const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true
  },
  image:{
    type: String,
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Array,
    default: [],
  }
});

// Create the Post model
const Post = mongoose.model('Post', postSchema);

// Export the Post model
module.exports = Post;
