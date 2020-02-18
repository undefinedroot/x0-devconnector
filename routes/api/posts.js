const express = require('express');
const router = express.Router();
const passport = require('passport');

// Post model
const Post = require('../../models/Post');
// Profile model
const Profile = require('../../models/Profile');

const validatePostInput = require('../../validation/post');

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => {
      if (posts === null) throw Error;
      res.json(posts);
    })
    .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', ({ params: { id } }, res) => {
  Post.findById(id)
    .then(post => {
      if (post === null) throw Error;
      res.json(post);
    })
    .catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), ({ body: { text, name, avatar }, user }, res) => {
  const { errors, isValid } = validatePostInput(text);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text, name, avatar, user: user.id
  });
  newPost.save().then(post => res.json(post));
});

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), ({ params: { id }, user }, res) => {
  Profile.findOne({ user: user.id })
    .then(profile => {
      Post.findById(id)
        .then(post => {
          // check for post owner before deleting
          if (post.user.toString() !== user.id) {
            return res.status(401).json({ notauthorized: 'User not authorized' });
          }
          // Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
});

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), ({ params: { id }, user }, res) => {
  Profile.findOne({ user: user.id })
    .then(profile => {
      Post.findById(id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === user.id).length > 0) {
            return res.status(400).json({ alreadyliked: 'User already liked this post' });
          }
          // Add user id to likes array, add to beginning
          post.likes.unshift({ user: user.id });
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
});

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), ({ params: { id }, user }, res) => {
  Profile.findOne({ user: user.id })
    .then(profile => {
      Post.findById(id)
        .then(post => {
          if (post.likes.filter(like => like.user.toString() === user.id).length === 0) {
            return res.status(400).json({ notliked: 'You have not yet liked this post' });
          }
          // Get remove index
          const removeIndex = post.likes.map(item => item.user.toString()).indexOf(user.id);
          // Splice out f array
          post.likes.splice(removeIndex, 1);
          // Save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
});

// @route   POST api/posts/comment/:id
// @desc    Comment a post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }),
  ({
    params: { id }, body: { text, name, avatar }, user
  }, res) => {

    const { errors, isValid } = validatePostInput(text);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(id)
      .then(post => {
        // Create new comment
        const newComment = { text, name, avatar, user: user.id };
        // Add to comments array
        post.comments.unshift(newComment);
        // Save
        post.save().then(post => res.json(post));
      })
      .catch(res => res.status(404).json({ postnotfound: 'No post found' }));
  });

// @route   Delete api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }),
  ({
    params: { id, comment_id }, user
  }, res) => {

    Post.findById(id)
      .then(post => {
        // Check to see if comment exists
        if (post.comments.filter(comment => comment._id.toString() === comment_id).length === 0) {
          return res.status(404).json({ commentnotexists: 'Comment does not exist' });
        }
        // Get remove index
        const removeIndex = post.comments.map(item => item._id.toString()).indexOf(comment_id);
        // Splice comment out of array
        post.comments.splice(removeIndex, 1);
        // Save
        post.save().then(post => res.json(post));
      })
      .catch(res => res.status(404).json({ postnotfound: 'No post found' }));
  });

module.exports = router;