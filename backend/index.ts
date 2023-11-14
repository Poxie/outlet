import fs from 'fs';
// @ts-ignore
import * as imageDataURI from 'image-data-uri';
import { createConnection } from './database';
import cors from 'cors';
import express from 'express';
import bodyParserer from 'body-parser';
import fileUpload, { UploadedFile } from 'express-fileupload';
import 'dotenv/config'
import { createId } from './utils';
import { getWeeklyDeal } from './controllers/deals';
import { getEvent } from './controllers/events';

const app = express();
app.use(cors({ 
    origin: process.env.FRONTEND_ORIGIN
}));
app.use(express.static(__dirname + '/imgs'));
app.use(bodyParserer.json({ limit: '200mb' }))

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
app.delete('/veckans-deal/:dealId', async (req, res) => {
    const deal = await getWeeklyDeal(req.params.dealId);
    if(!deal) return res.status(404).send({ message: 'Weekly deal not found.' });

    try {
        fs.unlinkSync(`imgs/veckans-deal/${deal.image}`);
    } catch(error) {
        console.error(error);
    }

    const db = await createConnection();
    db.execute('DELETE FROM veckans_deal WHERE ID = ?', [deal.id]);

    res.send({});
})

app.get('/events', async (req, res) => {
    const db = await createConnection();
    
    const [data] = await db.execute('SELECT * FROM events');

    res.send(data);
})
app.post('/events', async (req, res) => {
    const db = await createConnection();

    const title = req.body.title;
    const description = req.body.description;
    const image = req.body.image;
    
    if(!title) return res.status(400).send({ message: 'Title is required.' });
    if(!description) return res.status(400).send({ message: 'Description is required.' });
    if(!image) return res.status(400).send({ message: 'Image is required.' });
    if(Array.isArray(image)) return res.status(400).send({ message: 'Image should be an object.' });;
    
    const id = await createId('events');

    let imageResponse: string;
    try {
        imageResponse = await imageDataURI.outputFile(image, `imgs/events/${id}`);
    } catch {
        throw new Error('Unable to save image.');
    }
    const imageName = imageResponse.split('/').at(-1);

    const [data] = await db.execute(
        'INSERT INTO events (id, title, description, image, active) VALUES (?,?,?,?,?)', 
        [id, title, description, imageName, 1],
    );

    res.send({ id, title, description, image: imageName });
})
app.get('/events/:eventId', async (req, res) => {
    const event = await getEvent(req.params.eventId);
    if(!event) return res.status(404).send({ message: 'Event not found.' });

    res.send(event);
})
app.delete('/events/:eventId', async (req, res) => {
    const event = await getEvent(req.params.eventId);
    if(!event) return res.status(404).send({ message: 'Event not found.' });

    try {
        fs.unlinkSync(`imgs/events/${event.image}`);
    } catch(error) {
        console.error(error);
    }

    const db = await createConnection();
    db.execute('DELETE FROM events WHERE ID = ?', [event.id]);

    res.send({});
})

app.listen(process.env.PORT, () => console.log(`Backend running on ${process.env.PORT}`))