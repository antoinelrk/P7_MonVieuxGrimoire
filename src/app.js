import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Database from './core/Database.js'
import Router from './Router.js'
import Model from './core/Model.js'
import Security from './middlewares/Security.js'

dotenv.config()
const env = process.env

const webServer = express()
webServer.use(cors({
    origin: process.env.ALLOWED_CORS.split(','),
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
    optionsSuccessStatus: 200
}))

const db = Database.connect({
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    dbName: env.DB_NAME
})

Model.initialize(db)

webServer.use(express.json())
webServer.use('/uploads', express.static(`${process.cwd()}/uploads`));
webServer.use(Security)

Router(webServer, process.env.APP_PORT)

const getDb = () => mongoose
const getWebserver = () => webServer
const getEnv = () => env

export default {
    getDb,
    getWebserver,
    getEnv,
}
