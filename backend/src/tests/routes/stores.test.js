import request from 'supertest';
import express from 'express';
import routes from '../../routes/stores';
import Stores from "../../modules/stores";

jest.mock('../../modules/stores');

const app = express();
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