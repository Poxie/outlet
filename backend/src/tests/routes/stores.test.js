import express from 'express';
import bodyParser from 'body-parser';
import request from 'supertest';

jest.mock('../../modules/stores', () => ({
    all: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
}));
jest.mock('../../middleware/authHandler', () => jest.fn((req, res, next) => next()));

import routes from '../../routes/stores';
import Stores from '../../modules/stores';
import { APIBadRequestError } from '../../errors/apiBadRequestError';

const app = express()
app.use(bodyParser.json({ limit: '50mb' }))
app.use('', routes);

// Mock store array
const mockStoreData = { name: 'Test Store', address: 'Test Address', saturdays: 'Test Saturdays', sundays: 'Test Sundays', weekdays: 'Test Weekdays', email: 'Test Email', phoneNumber: 'Test Phone',  instagram: 'Test Instagram' };
const mockStore = { name: 'Test Store', id: '123', addedAt: '123', address: 'Test Address', saturdays: 'Test Saturdays', sundays: 'Test Sundays', weekdays: 'Test Weekdays', email: 'Test Email', phoneNumber: 'Test Phone',  instagram: 'Test Instagram' };
const mockStores = [mockStore];

describe('GET /stores', () => {
    it('should return all stores', async () => {
        Stores.all.mockResolvedValue(mockStores);

        const res = await request(app).get('/stores');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockStores);
        expect(Stores.all).toHaveBeenCalled();
    })
})
describe('PUT /stores', () => {
    it('should return 400 if no properties are sent', async () => {
        const res = await request(app)
            .put('/stores')
            .send()
            .set('Content-Type', 'application/json');
            
        expect(res.status).toBe(400);
    })
    it('should return 400 if invalid properties are sent', async () => {
        const res = await request(app)
            .put('/stores')
            .send({ notAStoreProperty: 1 })
            .set('Content-Type', 'application/json');
        
        expect(res.status).toBe(400);
    })
    it('should return 400 if required properties are not sent', async () => {
        const storeWithoutRequiredProperties = { ...mockStore };
        delete storeWithoutRequiredProperties.name;

        const res = await request(app)
            .put('/stores')
            .send(storeWithoutRequiredProperties)
            .set('Content-Type', 'application/json');
        
        expect(res.status).toBe(400);
    })
    it('should create and return a store', async () => {
        Stores.put.mockResolvedValue(mockStore);

        const res = await request(app)
            .put('/stores')
            .send(mockStoreData)
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockStore);
        expect(Stores.put).toHaveBeenCalled();
    })
})
describe('PATCH /stores/:id', () => {
    beforeEach(() => {
        Stores.get.mockResolvedValue(mockStore);
    })

    it('should return 404 if no store is found', async () => {
        Stores.get.mockResolvedValue(null);

        const res = await request(app)
            .patch('/stores/123')
            .send({ name: mockStore.name })
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(404);
        expect(Stores.get).toHaveBeenCalled();
    })
    it('should return 400 if no properties are sent', async () => {
        const res = await request(app)
            .patch('/stores/123')
            .send()
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(400);
    })
    it('should return 400 if invalid properties are sent', async () => {
        const res = await request(app)
            .patch('/stores/123')
            .send({ notAStoreProperty: 1 })
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(400);
    })
    it('should return 400 if required properties are missing values', async () => {
        const res = await request(app)
            .patch('/stores/123')
            .send({ name: '' })
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(400);
    })
    it('should update and return a store', async () => {
        const newStore = { ...mockStore, name: 'New Store Name' };
        Stores.patch.mockResolvedValue(newStore);

        const res = await request(app)
            .patch('/stores/123')
            .send({ name: newStore.name })
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(newStore);
        expect(Stores.patch).toHaveBeenCalled();
    })
})
describe('DELETE /stores/:id', () => {
    it('should return 404 if no store is found', async () => {
        Stores.get.mockResolvedValue(null);

        const res = await request(app).delete('/stores/123');

        expect(res.status).toBe(404);
        expect(Stores.get).toHaveBeenCalled();
    })
    it('should delete the store and return an empty object', async () => {
        Stores.get.mockResolvedValue(mockStore);
        Stores.delete.mockResolvedValue({});

        const res = await request(app).delete('/stores/123');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({});
        expect(Stores.get).toHaveBeenCalled();
        expect(Stores.delete).toHaveBeenCalled();
    })
})