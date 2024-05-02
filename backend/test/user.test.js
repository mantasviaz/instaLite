const request = require('supertest');
const app = require('../app');
const sequelize= require('../config/dbConfig.js');
const User = require('../models/user');


//jest.setTimeout(10000); 

let userId; // Variable to hold the user ID for reuse in other tests

describe('User Endpoints', () => {
  beforeEach(async () => {

  });
  afterAll(async () => {

    //await sequelize.close();
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

    it('should handle validation errors and return 500 status', async () => {
      const userData = {
          username: '',
          email: 'bademail',
          password: 'pass',
          firstName: '',
          lastName: ''
      };

      const response = await request(app)
          .post('/api/users/register')
          .send(userData);
      expect(response.status).toBe(500);
    });
  });

  describe('POST /login', () => {
    it('should authenticate user and return 200 status', async () => {
      const loginData = {
          email: 'test9@example.com',
          password: 'password123'
      };

      const response = await request(app)
          .post('/api/users/login')
          .send(loginData);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', loginData.email);
    });

    it('should reject wrong credentials and return 401 status', async () => {
      const loginData = {
          email: 'test9@example.com',
          password: 'wrongpassword'
      };

      const response = await request(app)
          .post('/api/users/login')
          .send(loginData);
      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /:userId', () => {
    it('should update user data and return 200 status', async () => {
      const updateData = {
        first_name: 'NameChange1',
        last_name: 'NameChange1'
      };
  
      // Log the user's data before the update attempt
      const preUpdateUser = await User.findByPk(userId);
      //console.log('Pre-update user data:', preUpdateUser.toJSON());
  
      const response = await request(app)
        .patch(`/api/users/${userId}`) // Use dynamic user ID
        .send(updateData);
  
      //console.log('API response:', response.body);
  
      expect(response.status).toBe(200);
      expect(response.body.first_name).toBe(updateData.first_name);
      expect(response.body.last_name).toBe(updateData.last_name);
    });
  
    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .patch('/api/users/999') // Assume user 999 does not exist
        .send({ firstName: 'Test' });
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

    it('should return 404 if no user found to delete', async () => {
      const response = await request(app)
          .delete('/api/users/999'); // Assume user 999 does not exist
      expect(response.status).toBe(404);
    });
  });
});
