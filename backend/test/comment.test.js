const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/dbConfig');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

jest.setTimeout(10000);

describe('Comment Endpoints', () => {
  let user, post;

  beforeAll(async () => {
    try {
      await sequelize.sync({ force: true });
      user = await User.create({
        username: 'testUser',
        password_hash: 'password123', // This will be hashed by the hook
        email: 'user@example.com',
        first_name: 'Test',
        last_name: 'User'
      });
      post = await Post.create({
        userId: user.userId,
        text: 'This is a test post'
      });
    } catch (error) {
      console.error('Setup failed:', error);
    }
  });

  afterAll(async () => {
    try {
      await sequelize.sync({ force: true });
      await sequelize.close();
    } catch (error) {
      console.error('Teardown failed:', error);
    }
  });

  test('POST /api/posts/{post_id}/comments should create a new comment and return 201 status', async () => {
    const commentData = {
      userId: user.userId,
      text: 'This is a comment'
    };
    const response = await request(app).post(`/api/posts/${post.postId}/comments`).send(commentData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('text', commentData.text);
  });

  test('GET /api/posts/{post_id}/comments should retrieve comments for a post and have a 200 status', async () => {
    const response = await request(app).get(`/api/posts/${post.postId}/comments`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        text: 'This is a comment'
      })
    ]));
  });
});
