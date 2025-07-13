const express = require('express');
const { createPost, getPosts, getPost, updatePost, deletePost } = require('../controllers/posts');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').post(protect, createPost).get(getPosts);
router.route('/:id').get(getPost).put(protect, updatePost).delete(protect, deletePost);

module.exports = router;