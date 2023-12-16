import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { myDataSource } from '../app-data-source';
import { People } from '../entity/people.entity';
import { APIBadRequestError } from '../errors/apiBadRequestError';
import { createId } from '../utils';
import { authHandler } from '../middleware/authHandler';
import { APIUnauthorizedError } from '../errors/apiUnauthorizedError';

const MIN_USERNAME_LENGTH = 2;
const MAX_USERNAME_LENGTH = 32;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 64;

const router = express.Router();

const createAuthToken = (id: string) => jwt.sign({ id }, process.env.JWT_PRIVATE_TOKEN);

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    
    if(!username) return next(new APIBadRequestError('Username is required.'));
    if(!password) return next(new APIBadRequestError('Password is required.'));

    const user = await myDataSource.getRepository(People).findOneBy({ username });
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
    const people = await myDataSource.getRepository(People)
        .createQueryBuilder('people')
        .select(['people.id', 'people.username'])
        .getMany();

    res.send(people);
})
router.post('/people', authHandler, async (req, res, next) => {
    const { username, password } = req.body;
    
    if(!username) return next(new APIBadRequestError('Username is required.'));
    if(username.length < MIN_USERNAME_LENGTH || username.length > MAX_USERNAME_LENGTH) {
        return next(new APIBadRequestError(`Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH}.`));
    }

    if(!password) return next(new APIBadRequestError('Password is required.'));
    if(password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
        return next(new APIBadRequestError(`Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH}.`));
    }

    const exists = await myDataSource.getRepository(People).findOneBy({ username });
    if(exists) return next(new APIBadRequestError('Username is taken.'));
    
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS));
    const encryptedPassword = await bcrypt.hash(password, salt);

    const id = await createId('people');
    const person = myDataSource.getRepository(People).create({
        id,
        username,
        password: encryptedPassword,
    })
    await myDataSource.getRepository(People).save(person);

    const token = createAuthToken(id);
    
    res.send({
        user: { id, username },
        token,
    })
})

export default router;