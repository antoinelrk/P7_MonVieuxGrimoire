import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Database from './core/Database.js'
import Router from './core/Router.js'
import Model from './core/Model.js'
import Middleware from './core/Middleware.js'
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
webServer.use(express.json())

webServer.use('/uploads', express.static(`${process.cwd()}/uploads`));

const db = Database.connect({
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    dbName: env.DB_NAME
})

webServer.use(Security)

const arrayOfMiddlewares = await Middleware.initialize().then((elements) => {
    Router.initialize(webServer, env.APP_PORT, env.API_PREFIX, elements)
})
Model.initialize(db)

const getDb = () => mongoose
const getRouter = () => Router
const getWebserver = () => webServer
const getEnv = () => env
const getMiddleware = () => arrayOfMiddlewares

export default {
    getDb,
    getRouter,
    getWebserver,
    getEnv,
    getMiddleware
}
