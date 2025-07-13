const Post = require('../models/Post');
const User = require('../models/User');
const slugify = require('slugify');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const author = req.user.id;
    const slug = slugify(title, { lower: true });
    const post = await Post.create({ title, content, category, author, slug });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const query = category ? { category } : {};
    const posts = await Post.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'User not authorized to update this post' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    if (title) {
      post.slug = slugify(title, { lower: true });
    }

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'User not authorized to delete this post' });
    }

    await post.remove();
    res.status(200).json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};