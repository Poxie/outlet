import * as express from 'express';
import * as bcrypt from 'bcrypt';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import People from '../modules/people';
import { APIUnauthorizedError } from '../errors/apiUnauthorizedError';
import { createAuthToken } from '../utils';

const router = express.Router();

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    
    if(!username) return next(new APIBadRequestError('Username is required.'));
    if(!password) return next(new APIBadRequestError('Password is required.'));

    const user = await People.getByUsername(username, true);
    if(!user) return next(new APIUnauthorizedError('Invalid credentials.'))

    const match = await bcrypt.compare(password, user.password);
    if(!match) return next(new APIUnauthorizedError('Invalid credentials.'))

    const token = createAuthToken(user.id);

    const userWithoutPassword = await People.getById(user.id);

    res.send({ token, user: userWithoutPassword });
})

export default router;