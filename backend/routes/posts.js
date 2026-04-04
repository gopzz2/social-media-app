// const router = require('express').Router();
// const Post = require('../models/Post');
// const auth = require('../middleware/auth');

// router.get('/', auth, async (req, res) => {
//   const posts = await Post.find().populate('userId', 'username');
//   res.json(posts);
// });

// router.post('/', auth, async (req, res) => {
//   const post = new Post({ ...req.body, userId: req.user.id });
//   await post.save();
//   res.json(post);
// });

// router.delete('/:id', auth, async (req, res) => {
//   await Post.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
//   res.json({ message: 'Deleted' });
// });

// module.exports = router;
const router = require('express').Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const posts = await Post.find().populate('userId', 'username');
  res.json(posts);
});

router.post('/', auth, async (req, res) => {
  const post = new Post({ ...req.body, userId: req.user.id });
  await post.save();
  res.json(post);
});

router.delete('/:id', auth, async (req, res) => {
  await Post.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ message: 'Deleted' });
});

// Like / Unlike route
router.put('/:id/like', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  const isLiked = post.likes.includes(req.user.id);
  if (isLiked) {
    post.likes = post.likes.filter(id => id.toString() !== req.user.id);
  } else {
    post.likes.push(req.user.id);
  }
  await post.save();
  res.json(post);
});
// Edit post route
router.put('/:id', auth, async (req, res) => {
  const post = await Post.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { title: req.body.title, description: req.body.description },
    { new: true }
  );
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
});

module.exports = router;