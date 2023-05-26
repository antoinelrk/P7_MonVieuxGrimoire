import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Database from './core/Database.js'
import Router from './core/Router.js'

dotenv.config()
const env = process.env

const webServer = express()
webServer.use(cors())
webServer.use(express.json())

const db = Database.connect({
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    host: env.DB_HOST
})

Router.initialize(webServer, env.APP_PORT)

/**
 * ! Zone de test
 */
const User = db.model('User', {
    name: String,
    age: Number
})

const user = new User({
    name: 'Antoine',
    age: 29
})

const getDb = () => mongoose
const getRouter = () => Router
const getWebserver = () => webServer

export default {
    getDb,
    getRouter,
    getWebserver
}