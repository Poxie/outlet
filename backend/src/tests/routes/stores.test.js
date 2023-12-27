import bodyParser from 'body-parser';
import request from 'supertest';
import express from 'express';
import Stores from "../../modules/stores";

jest.mock('../../modules/stores');
jest.mock('../../middleware/authHandler', () => jest.fn((req, res, next) => next()));

import routes from '../../routes/stores';
import { REQUIRED_STORE_PROPERTIES } from '../../utils/constants';

const app = express();
app.use(bodyParser.json({ limit: '50mb' }))
app.use('', routes);

describe('GET /stores', () => {
    it('should return all stores', async () => {
        const stores = [
            { name: 'Test Store', id: '123', addedAt: '123', address: 'Test Address', saturdays: 'Test Saturdays', sundays: 'Test Sundays', weekdays: 'Test Weekdays', email: 'Test Email', phoneNumber: 'Test Phone',  instagram: 'Test Instagram' },
        ];
        Stores.all.mockResolvedValue(stores);

        const res = await request(app).get('/stores');

        expect(res.status).toBe(200);
        expect(res.body).toEqual(stores);
    });
})
describe('PUT /stores', () => {
    const mockDatabaseStore = { name: 'Test Store', id: '123', addedAt: '123', address: 'Test Address', saturdays: 'Test Saturdays', sundays: 'Test Sundays', weekdays: 'Test Weekdays', email: 'Test Email', phoneNumber: 'Test Phone',  instagram: 'Test Instagram' };
    const mockStoreData = { name: 'Test Store', address: 'Test Address', saturdays: 'Test Saturdays', sundays: 'Test Sundays', weekdays: 'Test Weekdays', email: 'Test Email', phoneNumber: 'Test Phone',  instagram: 'Test Instagram' };

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
            .send({ ...mockStoreData, notAStoreProperty: 1 })
            .set('Content-Type', 'application/json');
        
        expect(res.status).toBe(400);
    })
    it('should return 400 if required properties are not sent', async () => {
        const storeWithoutRequiredProperties = { ...mockStoreData };
        for(const key of REQUIRED_STORE_PROPERTIES) {
            delete storeWithoutRequiredProperties[key];
        }

        const res = await request(app)
            .put('/stores')
            .send(storeWithoutRequiredProperties)
            .set('Content-Type', 'application/json');
        
        expect(res.status).toBe(400);
    })
    it('should create and return a store', async () => {
        Stores.put.mockResolvedValue(mockDatabaseStore);

        const res = await request(app)
            .put('/stores')
            .send(mockStoreData)
            .set('Content-Type', 'application/json');
        
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockDatabaseStore);
    })
})