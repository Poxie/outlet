import express from 'express';
import 'dotenv/config'

const app = express();

app.get(`/`, (req, res) => {
    res.send('Hello');
})

app.listen(process.env.PORT, () => console.log(`Backend running on ${process.env.PORT}`))