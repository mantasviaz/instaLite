const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/dbConfig');
const { registerUser, deleteUserById } = require('../controller/userController');
const User = require('../models/user');

describe('Friend Endpoints', () => {
    let user1, user2;

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        const createUser = async (userData) => {
            const mockReq = { body: userData };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            await registerUser(mockReq, mockRes);
            return mockRes.send.mock.calls[0][0]; // Assuming the user data is the first argument sent to mockRes.send
        };

        user1 = await createUser({
            username: 'usertester1',
            email: 'user111@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User1'
        });

        user2 = await createUser({
            username: 'usertest2',
            email: 'user100@example.com',
            password: 'password1234',
            firstName: 'Test',
            lastName: 'User2'
        });

        if (!user1.userId || !user2.userId) {
            console.error("User creation failed:", { user1, user2 });
            throw new Error("User creation failed, user IDs are null.");
        }
    });

    afterAll(async () => {
        try {
            if (user1 && user2) {
                await delete(user1.userId);
                await delete(user2.userId);
            }
            await sequelize.close();
        } catch (error) {
            console.error('Failed to clean up after tests:', error);
        }
    });

    test('POST /api/friends/:userId should create a new friendship and return 201 status', async () => {
        const response = await request(app).post(`/api/friends/${user1.userId}`).send({
            user_id_1: user1.userId,
            user_id_2: user2.userId,
            status: 'pending'
        });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('status', 'pending');
    });

    test('GET /api/friends/:userId should get all friendships for a user and have a 200 status', async () => {
        const response = await request(app).get(`/api/friends/${user1.userId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    user_id_1: user1.userId,
                    user_id_2: user2.userId,
                    status: 'pending'
                })
            ])
        );
    });

    test('PATCH /api/friends/:userId should update a friendship status and return 200 status', async () => {
        const response = await request(app).patch(`/api/friends/${user1.userId}`).send({
            user_id_1: user1.userId,
            user_id_2: user2.userId,
            status: 'accepted'
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'accepted');
    });
});
