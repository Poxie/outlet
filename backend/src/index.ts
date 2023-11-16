import 'dotenv/config'
import * as cors from 'cors';
import * as express from 'express';
import * as bodyParserer from 'body-parser';
import { myDataSource } from './app-data-source';
import router from './routes';

// Establish database connection
myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

const app = express();
app.use(cors({ 
    origin: process.env.FRONTEND_ORIGIN
}));
app.use(express.static(__dirname + '/imgs'));
app.use(bodyParserer.json({ limit: '50mb' }))

app.use('', router);

app.listen(process.env.PORT, () => console.log(`Backend running on ${process.env.PORT}`))