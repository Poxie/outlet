jest.mock('bcrypt', () => ({
    hash: jest.fn(() => Promise.resolve('hashedPassword')),
    compare: jest.fn(() => Promise.resolve(true)),
}));
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'token'),
}));
jest.mock('../../modules/people');
jest.mock('../../middleware/authHandler', () => jest.fn((req, res, next) => {
    res.locals.userId = '123';
    return next();
}));

import bcrypt from 'bcrypt';
import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';
import People from '../../modules/people';
import routes from '../../routes/people';

import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '../../utils/constants';

const app = express();
app.use(bodyParser.json({ limit: '50mb' }))
app.use('', routes);

describe('POST /login', () => {
    const mockPerson = { username: 'person', id: '123' };
    const mockPersonData = { username: 'person', password: 'test1234' };

    it('should return 400 if no username or password is sent', async () => {
        for(const key of Object.keys(mockPersonData)) {
            const res = await request(app)
                .post('/login')
                .send({ ...mockPersonData, [key]: undefined })
                .set('Content-Type', 'application/json');

            expect(res.status).toBe(400);
        }
    })
    it('should return 401 if user does not exist', async () => {
        People.getByUsername.mockResolvedValue(undefined);

        const res = await request(app)
            .post('/login')
            .send(mockPersonData)
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(401);
    })
    it('should return 401 if user and password do not match', async () => {
        People.getByUsername.mockResolvedValue(mockPersonData);
        bcrypt.compare.mockResolvedValue(false);

        const res = await request(app)
            .post('/login')
            .send({ ...mockPersonData, password: 'wrongPassword' })
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(401);
    })
    it('should return token and user if username and password match', async () => {
        People.getByUsername.mockResolvedValue(mockPersonData);
        People.getById.mockResolvedValue(mockPerson);
        bcrypt.compare.mockResolvedValue(true);

        const res = await request(app)
            .post('/login')
            .send(mockPersonData)
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            token: expect.any(String),
            user: mockPerson,
        });
    })
})

describe('GET /people/me', () => {
    it('should return 404 if person is not logged in or does not exist', async () => {
        People.getById.mockResolvedValue(undefined);

        const res = await request(app).get('/people/me');

        expect(res.status).toBe(404);
    })
    it('should return the logged in person', async () => {
        const mockPerson = { username: 'person', id: '123' };
        People.getById.mockResolvedValue(mockPerson);

        const res = await request(app).get('/people/me');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockPerson);
    })
})
describe('GET /people', () => {
    it('should return all people', async () => {
        const people = [
            { id: '123', useranme: 'Test Person' },
        ]
        People.all.mockResolvedValue(people);

        const res = await request(app).get('/people');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(people);
    });
})
describe('POST /people', () => {
    const mockPersonData = { username: 'person', password: 'test1234' };

    beforeEach(() => {
        People.post.mockResolvedValue(mockPersonData);
    })

    it('should return 400 if invalid properties are sent', async () => {
        for(const prop of Object.keys(mockPersonData)) {
            const res = await request(app)
                .post('/people')
                .send({ ...mockPersonData, [prop]: undefined })
                .set('Content-Type', 'application/json');
            
            expect(res.status).toBe(400);
        }
    })
    it('should return 400 if username or password length is not within the threshold', async () => {
        const tooShortUsername = { username: 'a'.repeat(MIN_USERNAME_LENGTH - 1), password: 'test1234' };
        const tooLongUsername = { username: 'a'.repeat(MAX_USERNAME_LENGTH + 1), password: 'test1234' };
        const tooShortPassword = { username: 'person', password: 'a'.repeat(MIN_PASSWORD_LENGTH - 1) };
        const tooLongPassword = { username: 'person', password: 'a'.repeat(MAX_PASSWORD_LENGTH + 1) };
    
        const testCases = [tooShortUsername, tooLongUsername, tooShortPassword, tooLongPassword];
    
        for(const testCase of testCases) {
            const res = await request(app)
                .post('/people')
                .send(testCase)
                .set('Content-Type', 'application/json');
            
            expect(res.status).toBe(400);
        }
    });
    it('should check if user exists', async () => {
        People.getByUsername.mockResolvedValue(mockPersonData);

        const res = await request(app)
            .post('/people')
            .send(mockPersonData)
            .set('Content-Type', 'application/json');
        
        expect(res.status).toBe(401);
    })
    it('should create a new user and return token and user', async () => {
        People.getByUsername.mockResolvedValue(undefined);

        const res = await request(app)
            .post('/people')
            .send(mockPersonData)
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            token: expect.any(String),
            user: mockPersonData,
        });
    })
})
describe('DELETE /people/:userId', () => {
    const mockPerson = { username: 'person', id: '123' };
    const mockPersonTwo = { username: 'person2', id: '456' };

    it('should return 404 if person does not exist', async () => {
        People.getById.mockResolvedValue(undefined);

        const res = await request(app).delete(`/people/${mockPerson.id}`);

        expect(res.status).toBe(404);
    })
    it('should return 403 if person is the same as the logged in user', async () => {
        People.getById.mockResolvedValue(mockPerson);

        const res = await request(app).delete(`/people/${mockPerson.id}`);
        expect(res.status).toBe(403);
    })
    it('should delete a person', async () => {
        People.getById.mockResolvedValue(mockPersonTwo);
        People.delete.mockResolvedValue({});

        const res = await request(app).delete(`/people/${mockPersonTwo.id}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({});
    })
})