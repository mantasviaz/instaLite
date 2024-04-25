const request = require('supertest');
// Use only one of these depending on your project structure.
const app = require('../app'); // Typically, you use this for testing.

describe('User Endpoints', () => {
    it('should create a new user', async () => {
      const res = await request(app)
          .post('/api/users/register')
          .send({
              username: 'testuser',
              email: 'test@example.com',
              password: 'password123',
              firstName: 'Test',
              lastName: 'User'
          });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('username', 'testuser');
    }, 10000); // Increasing timeout to 10 seconds
  });
  
  // Add more tests

