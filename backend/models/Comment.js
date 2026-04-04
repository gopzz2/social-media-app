const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text:   { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);