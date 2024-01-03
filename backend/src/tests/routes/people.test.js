const JWT_TOKEN = 'token';
const BCRYPT_SALT = 'salt';
const BCRYPT_HASHED_PASSWORD = 'hashedPassword';

jest.mock('bcrypt', () => ({
    hash: jest.fn(() => Promise.resolve(BCRYPT_HASHED_PASSWORD)),
    compare: jest.fn(() => Promise.resolve(true)),
    genSalt: jest.fn(() => Promise.resolve(BCRYPT_SALT)),
}));
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => JWT_TOKEN),
}));
jest.mock('../../modules/people', () => ({
    post: jest.fn(),
    getById: jest.fn(),
    getByUsername: jest.fn(),
    all: jest.fn(),
    delete: jest.fn(),
}));
jest.mock('../../middleware/authHandler', () => jest.fn((req, res, next) => {
    res.locals.userId = '123';
    return next();
}));

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express, { json } from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';
import People from '../../modules/people';
import routes from '../../routes/people';

import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '../../utils/constants';

const app = express();
app.use(bodyParser.json({ limit: '50mb' }))
app.use('', routes);

const mockPersonData = {
    username: 'Test Username',
    password: 'Test Password',
};
const mockDatabasePerson = {
    id: '123',
    username: 'Test Username',
    password: 'Test Password',
};
const mockPerson = {
    id: '123',
    username: 'Test Username',
};
const mockPersonTwo = {
    id: '456',
    username: 'Test Username Two',
};

describe('POST /people', () => {
    it('should return 400 if no properties are sent', async () => {
        const res = await request(app)
            .post('/people')
            .send()
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(400);
    })
    it('should return 400 if invalid properties are sent', async () => {
        const res = await request(app)
            .post('/people')
            .send({ notAPersonProperty: 1 })
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(400);
    })
    it('should return 400 if required properties are not sent', async () => {
        const personWithoutRequiredProperties = { ...mockPersonData };
        delete personWithoutRequiredProperties.username;

        const res = await request(app)
            .post('/people')
            .send(personWithoutRequiredProperties)
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(400);
    })
    it('should return 400 if username or password are invalid lengths', async () => {
        const peopleToTest = [
            { ...mockPersonData, username: 'a'.repeat(MIN_USERNAME_LENGTH - 1) },
            { ...mockPersonData, username: 'a'.repeat(MAX_USERNAME_LENGTH + 1) },
            { ...mockPersonData, password: 'a'.repeat(MIN_PASSWORD_LENGTH - 1) },
            { ...mockPersonData, password: 'a'.repeat(MAX_PASSWORD_LENGTH + 1) },
        ]

        for(const person of peopleToTest) {
            const res = await request(app)
                .post('/people')
                .send(person)
                .set('Content-Type', 'application/json');

            expect(res.status).toBe(400);
        }
    })
    it('should return 400 if username already exists', async () => {
        People.getByUsername.mockResolvedValue(mockPersonData);

        const res = await request(app)
            .post('/people')
            .send(mockPersonData)
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(400);
        expect(People.getByUsername).toHaveBeenCalledWith(mockPersonData.username);
    })
    it('should hash the password and create and return a person and a token', async () => {
        People.getByUsername.mockResolvedValue(null);
        People.post.mockResolvedValue(mockPerson);

        const res = await request(app)
            .post('/people')
            .send(mockPersonData)
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ user: mockPerson, token: JWT_TOKEN });
        expect(bcrypt.genSalt).toHaveBeenCalledWith(Number(process.env.BCRYPT_SALT_ROUNDS));
        expect(bcrypt.hash).toHaveBeenCalledWith(mockPersonData.password, BCRYPT_SALT);
        expect(jwt.sign).toHaveBeenCalledWith({ id: mockDatabasePerson.id }, process.env.JWT_SECRET);
        expect(People.post).toHaveBeenCalledWith({ ...mockPersonData, password: BCRYPT_HASHED_PASSWORD });
    })
})
describe('GET /people', () => {
    it('should return all people', async () => {
        People.all.mockResolvedValue([mockPerson]);

        const res = await request(app).get('/people');

        expect(res.status).toBe(200);
        expect(res.body).toEqual([mockPerson]);
        expect(People.all).toHaveBeenCalled();
    })
})
describe('DELETE /people/:id', () => {
    afterEach(() => {
        People.getById.mockReset();
    })

    it('should return 404 if no person is found', async () => {
        People.getById.mockResolvedValue(null);

        const res = await request(app).delete('/people/123');

        expect(res.status).toBe(404);
        expect(People.getById).toHaveBeenCalledWith('123');
    })
    it('should return 403 if person is self', async () => {
        People.getById
            .mockResolvedValueOnce(mockPerson)
            .mockResolvedValueOnce(mockPerson);

        const res = await request(app).delete('/people/123');

        expect(res.status).toBe(403);
        expect(People.getById).toHaveBeenCalledTimes(2);
        expect(People.getById).toHaveBeenCalledWith('123');
        expect(People.getById).toHaveBeenCalledWith('123');
    })
    it('should delete the person', async () => {
        People.delete.mockResolvedValue();
        People.getById
            .mockResolvedValueOnce(mockPerson)
            .mockResolvedValueOnce(mockPersonTwo);

        const res = await request(app).delete('/people/456');

        expect(res.status).toBe(200);
        expect(People.getById).toHaveBeenCalledTimes(2);
        expect(People.delete).toHaveBeenCalledWith('456');
    })
})