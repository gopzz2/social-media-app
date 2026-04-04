const router = require('express').Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

// Get comments for a post
router.get('/:postId', auth, async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId })
    .populate('userId', 'username');
  res.json(comments);
});

// Add comment
router.post('/:postId', auth, async (req, res) => {
  const comment = new Comment({
    text: req.body.text,
    postId: req.params.postId,
    userId: req.user.id
  });
  await comment.save();
  const populated = await comment.populate('userId', 'username');
  res.json(populated);
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  await Comment.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ message: 'Deleted' });
});

module.exports = router;