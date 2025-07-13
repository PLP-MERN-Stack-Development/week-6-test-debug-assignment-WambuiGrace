const { createPost, getPosts, getPost, updatePost, deletePost } = require('../../../src/controllers/posts');
const Post = require('../../../src/models/Post');
const slugify = require('slugify');

jest.mock('../../../src/models/Post');
jest.mock('slugify');

describe('Posts Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      const req = {
        body: {
          title: 'Test Post',
          content: 'This is a test post',
          category: '123',
        },
        user: {
          id: '456',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const slug = 'test-post';
      slugify.mockReturnValue(slug);
      const post = { ...req.body, author: req.user.id, slug };
      Post.create.mockResolvedValue(post);

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(post);
    });

    it('should return 400 if an error occurs', async () => {
      const req = {
        body: {
          title: 'Test Post',
          content: 'This is a test post',
          category: '123',
        },
        user: {
          id: '456',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const error = new Error('Something went wrong');
      Post.create.mockRejectedValue(error);

      await createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getPosts', () => {
    it('should return all posts', async () => {
      const req = {
        query: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const posts = [
        { title: 'Post 1' },
        { title: 'Post 2' },
      ];
      Post.find.mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(posts),
      });

      await getPosts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(posts);
    });
  });

  describe('getPost', () => {
    it('should return a single post', async () => {
      const req = {
        params: {
          id: '123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const post = { title: 'Test Post' };
      Post.findById.mockResolvedValue(post);

      await getPost(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(post);
    });

    it('should return 404 if post is not found', async () => {
      const req = {
        params: {
          id: '123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Post.findById.mockResolvedValue(null);

      await getPost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });
  });

  describe('updatePost', () => {
    it('should update a post', async () => {
      const req = {
        params: {
          id: '123',
        },
        body: {
          title: 'Updated Post',
        },
        user: {
          id: '456',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const post = {
        author: '456',
        save: jest.fn().mockResolvedValue({ title: 'Updated Post' }),
      };
      Post.findById.mockResolvedValue(post);

      await updatePost(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ title: 'Updated Post' });
    });

    it('should return 404 if post is not found', async () => {
      const req = {
        params: {
          id: '123',
        },
        body: {
          title: 'Updated Post',
        },
        user: {
          id: '456',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Post.findById.mockResolvedValue(null);

      await updatePost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });

    it('should return 403 if user is not the author', async () => {
      const req = {
        params: {
          id: '123',
        },
        body: {
          title: 'Updated Post',
        },
        user: {
          id: '789',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const post = {
        author: '456',
      };
      Post.findById.mockResolvedValue(post);

      await updatePost(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not authorized to update this post' });
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      const req = {
        params: {
          id: '123',
        },
        user: {
          id: '456',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const post = {
        author: '456',
        remove: jest.fn().mockResolvedValue({}),
      };
      Post.findById.mockResolvedValue(post);

      await deletePost(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Post removed' });
    });

    it('should return 404 if post is not found', async () => {
      const req = {
        params: {
          id: '123',
        },
        user: {
          id: '456',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      Post.findById.mockResolvedValue(null);

      await deletePost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });

    it('should return 403 if user is not the author', async () => {
      const req = {
        params: {
          id: '123',
        },
        user: {
          id: '789',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const post = {
        author: '456',
      };
      Post.findById.mockResolvedValue(post);

      await deletePost(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not authorized to delete this post' });
    });
  });
});