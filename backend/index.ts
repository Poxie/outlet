import { createConnection } from './database';
import express from 'express';
import 'dotenv/config'

const app = express();

app.get('/veckans-deal', async (req, res) => {
    const db = await createConnection();
    
    const [data] = await db.execute('SELECT * FROM veckans_deal');

    res.send(data);
})

app.listen(process.env.PORT, () => console.log(`Backend running on ${process.env.PORT}`))