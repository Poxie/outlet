jest.mock('../../modules/people', () => ({
    getByUsername: jest.fn(),
    getById: jest.fn(),
}));
jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express, { json } from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';
import People from '../../modules/people';
import routes from '../../routes/login';

const app = express();
app.use(bodyParser.json({ limit: '50mb' }))
app.use('', routes);

const testToken = 'token';
const mockData = { username: 'Test Username', password: 'Test Password' };
const mockUser = { username: mockData.username, id: '123' };
const mockDatabaseUser = {...mockUser, password: 'Test Hashed Password' };

describe('POST /login', () => {
    it('should return 400 if username or password is not sent', async () => {
        for(const key of Object.keys(mockData)) {
            const data = { ...mockData };
            delete data[key];

            const res = await request(app)
                .post('/login')
                .send(data)
                .set('Content-Type', 'application/json');

            expect(res.status).toBe(400);
        }
    })
    it('should return 401 if user is not found', async () => {
        People.getByUsername.mockResolvedValue(null);

        const res = await request(app)
            .post('/login')
            .send(mockData)
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(401);
        expect(People.getByUsername).toHaveBeenCalledWith(mockData.username, true);
    })
    it('should return 401 if password is incorrect', async () => {
        People.getByUsername.mockResolvedValue(mockDatabaseUser);
        bcrypt.compare.mockResolvedValue(false);

        const res = await request(app)
            .post('/login')
            .send(mockData)
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(401);
        expect(People.getByUsername).toHaveBeenCalledWith(mockData.username, true);
        expect(bcrypt.compare).toHaveBeenCalledWith(mockData.password, mockDatabaseUser.password);
    })
    it('should return 200, a user object and a token if login is successful', async () => {
        People.getByUsername.mockResolvedValue(mockDatabaseUser);
        People.getById.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue(testToken);

        const res = await request(app)
            .post('/login')
            .send(mockData)
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ user: mockUser, token: testToken });
        expect(People.getById).toHaveBeenCalledWith(mockDatabaseUser.id);
        expect(People.getByUsername).toHaveBeenCalledWith(mockData.username, true);
        expect(bcrypt.compare).toHaveBeenCalledWith(mockData.password, mockDatabaseUser.password);
        expect(jwt.sign).toHaveBeenCalledWith({ id: mockDatabaseUser.id }, process.env.JWT_SECRET);
    })
})