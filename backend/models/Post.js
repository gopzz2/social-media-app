// const mongoose = require('mongoose');
// const PostSchema = new mongoose.Schema({
//   title:       { type: String, required: true },
//   description: { type: String, required: true },
//   userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// }, { timestamps: true });
// module.exports = mongoose.model('Post', PostSchema);
const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
module.exports = mongoose.model('Post', PostSchema);