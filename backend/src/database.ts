import mysql from 'mysql2/promise';
import 'dotenv/config'

const createConnection = async () => await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

export { createConnection };