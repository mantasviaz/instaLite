const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/dbConfig');
const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcryptjs');


//jest.setTimeout(10000); // Timeout for async operations

describe('Post Endpoints', () => {
  let userId, postId;

  // Create a user before running the test cases
  beforeAll(async () => {

  });
  describe('POST /register', () => {
    it('should create a new user and return 201 status', async () => {
      const userData = {
          username: 'newuser',
          email: 'test9@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User'
      };

      const response = await request(app)
          .post('/api/users/register')
          .send(userData);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('username', userData.username);
      userId = response.body.userId; // Store the userId for use in later tests
    });
});

  describe('POST /api/posts', () => {
    it('should create a new post and return 201 status', async () => {
      const postData = {
        userId: userId,
        image_url: 'http://example.com/image.png',
        text: 'This is a new post'
      };
      const response = await request(app).post('/api/posts').send(postData);
      expect(response.status).toBe(201);
      console.log(response.body);
      expect(response.body).toHaveProperty('text', postData.text);
      postId = response.body.postId;  // Save the post ID for later use
    });
  });

  describe('GET /api/posts/user/:user_id', () => {
    it('should return posts for the user and have a 200 status', async () => {
      const response = await request(app).get(`/api/posts/user/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            text: 'This is a new post'
          })
        ])
      );
    });
  });

  describe('DELETE /api/posts/:post_id', () => {
    it('should delete a post and return 200 status', async () => {
      const response = await request(app).delete(`/api/posts/${postId}`);
      expect(response.status).toBe(200);
      expect(response.text).toContain('Post deleted successfully');
    });

    it('should return 404 if the post is not found', async () => {
      const response = await request(app).delete(`/api/posts/${postId}`); // Trying to delete the same post again
      expect(response.status).toBe(404);
    });
  });
  describe('DELETE /:userId', () => {
    it('should delete a user and return 200 status', async () => {
      const response = await request(app)
          .delete(`/api/users/${userId}`); // Use dynamic user ID
      expect(response.status).toBe(200);
      expect(response.text).toContain("User deleted successfully");
    });
});
});
