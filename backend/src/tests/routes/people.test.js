jest.mock('bcrypt', () => ({
    hash: jest.fn(() => Promise.resolve('hashedPassword')),
}));
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'token'),
}));
jest.mock('../../modules/people');
jest.mock('../../middleware/authHandler', () => jest.fn((req, res, next) => next()));

import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';
import People from '../../modules/people';
import routes from '../../routes/people';

const app = express();
app.use(bodyParser.json({ limit: '50mb' }))
app.use('', routes);

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

    it('should return 400 if invalid properties are sent', async () => {
        for(const prop of Object.keys(mockPersonData)) {
            const res = await request(app)
                .post('/people')
                .send({ ...mockPersonData, [prop]: undefined })
                .set('Content-Type', 'application/json');
            
            expect(res.status).toBe(400);
        }
    })
    it('should check if user exists', async () => {
        People.getByUsername.mockResolvedValue(mockPersonData);
        People.post.mockResolvedValue(mockPersonData);

        const res = await request(app)
            .post('/people')
            .send(mockPersonData)
            .set('Content-Type', 'application/json');
        
        expect(res.status).toBe(401);
    })
    it('should create a new user and return token and user', async () => {
        People.getByUsername.mockResolvedValue(undefined);
        People.post.mockResolvedValue(mockPersonData);

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