import { createConnection } from './database';
import cors from 'cors';
import express from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import 'dotenv/config'
import { createId } from './utils';

const app = express();
app.use(cors({ 
    origin: process.env.FRONTEND_ORIGIN
}));

app.get('/veckans-deal', async (req, res) => {
    const db = await createConnection();
    
    const [data] = await db.execute('SELECT * FROM veckans_deal');

    res.send(data);
})
app.post('/veckans-deal', fileUpload(), async (req, res) => {
    const db = await createConnection();

    const image = req.files?.image;
    if(!image) return res.status(400).send({ message: 'Image is required.' });
    if(Array.isArray(image)) return res.status(400).send({ message: 'Image should be an object.' });;
    
    const id = await createId('veckans_deal');

    const extension = image.name.split('.').at(-1);
    const imageName = `${id}.${extension}`;
    image.mv(`imgs/veckans-deal/${imageName}`);

    const [data] = await db.execute(
        'INSERT INTO veckans_deal (id, image, active_deal) VALUES (?,?,?)', 
        [id, imageName, 1],
    );

    res.send({ id, image: imageName });
})

app.listen(process.env.PORT, () => console.log(`Backend running on ${process.env.PORT}`))