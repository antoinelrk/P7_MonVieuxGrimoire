import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Database from './core/Database.js'
dotenv.config()
const PORT = process.env.APP_PORT
const env = process.env
const app = express()

app.use(cors())

const client = new Database({
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    dbName: env.DB_NAME
})

app.get('/', async (request, response) => {
    response.send(`MonVieuxGrimoire API`)
})

app.listen(PORT, () => {
    console.log(`API Listen on port ${PORT}`)
})
