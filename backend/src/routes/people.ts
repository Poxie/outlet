import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { myDataSource } from '../app-data-source';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { createId, getUserIdFromHeaders } from '../utils';
import { APIUnauthorizedError } from '../errors/apiUnauthorizedError';
import { APINotFoundError } from '../errors/apiNotFoundError';
import { APIForbiddenError } from '../errors/apiForbiddenError';
import authHandler from '../middleware/authHandler';
import { Person } from '../entity/person.entity';
import People from '../modules/people';
import { MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from '../utils/constants';

const router = express.Router();

const createAuthToken = (id: string) => jwt.sign({ id }, process.env.JWT_PRIVATE_TOKEN);

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    
    if(!username) return next(new APIBadRequestError('Username is required.'));
    if(!password) return next(new APIBadRequestError('Password is required.'));

    const user = await myDataSource.getRepository(Person).findOneBy({ username });
    if(!user) return next(new APIUnauthorizedError('Invalid credentials.'))

    const match = await bcrypt.compare(password, user.password);
    if(!match) return next(new APIUnauthorizedError('Invalid credentials.'))

    const token = createAuthToken(user.id);

    res.send({ token, user: {
        id: user.id,
        username: user.username,
    } });
})
router.get('/people', authHandler, async (req, res, next) => {
    const people = await People.all();
    res.send(people);
})
router.get('/people/me', authHandler, async (req, res, next) => {
    const userId = res.locals.userId;
    if(!userId) {
        return next(new APIBadRequestError('User not found.'));
    }

    const user = await myDataSource.getRepository(Person).findOneBy({ id: userId });
    if(!user) {
        return next(new APIBadRequestError('User not found.'));
    }

    res.send({ username: user.username, id: user.id });
})
router.post('/people', authHandler, async (req, res, next) => {
    const { username, password } = req.body;

    if(!username) return next(new APIBadRequestError('Username is required.'));
    if(!password) return next(new APIBadRequestError('Password is required.'));
    
    if(username.length < MIN_USERNAME_LENGTH || username.length > MAX_USERNAME_LENGTH) {
        return next(new APIBadRequestError(`Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters.`));
    }
    if(password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
        return next(new APIBadRequestError(`Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`));
    }

    const existingUser = await People.getByUsername(username);
    if(existingUser) return next(new APIUnauthorizedError('Username is already taken.'));

    const hashedPassword = await bcrypt.hash(password, process.env.BCRYPT_SALT_ROUNDS);

    const createdUser = await People.post({
        username,
        password: hashedPassword,
    })

    const token = createAuthToken(createdUser.id);
    
    res.send({ token, user: createdUser });
})
router.delete('/people/:userId', authHandler, async (req, res, next) => {
    if(res.locals.userId === req.params.userId) {
        return next(new APIForbiddenError('You cannot remove yourself.'));
    }

    const user = await myDataSource.getRepository(Person).findOneBy({ id: req.params.userId });
    if(!user) {
        return next(new APINotFoundError('User not found.'));
    }

    await myDataSource.getRepository(Person).delete(user);

    res.send({});
})

export default router;