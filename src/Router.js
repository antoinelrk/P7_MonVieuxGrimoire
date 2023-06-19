import express from 'express'
import { query, body, param } from 'express-validator'

import Auth from './middlewares/Auth.js'
import Guest from './middlewares/Guest.js'
import FileManager from './middlewares/FileManager.js'

import AuthController from './controllers/AuthController.js'
import BookController from './controllers/BookController.js'

import User from './models/User.js'

const router = express.Router()

export default function (webServer, port) {
    router.post('/auth/login', [
        body('email').notEmpty().isEmail().custom(async value => {
            const user = await User.get().findOne({ email: value })
            if (user === null) throw new Error(`L'email n'existe pas`)
        }),
        body('password').notEmpty(),
    ], [ async (request, response, next) => Guest(request, response, next) ],
    async (request, response) => await AuthController.login(request, response))

    router.post('/auth/signup', [
        body('email').notEmpty().isEmail().custom(async value => {
            const user = await User.get().findOne({ email: value })
            if (user) throw new Error('E-mail already in use')
        }),
        body('password').notEmpty().isStrongPassword()
    ], [ async (request, response, next) => Guest(request, response, next) ],
    async (request, response) => await AuthController.signup(request, response))

    router.get('/books', async (request, response) => await BookController.list(request, response))
    router.get('/books/bestrating', async (request, response) => await BookController.list(request, response))
    router.get('/books/:id', [
        param('id').notEmpty().isNumeric().custom() //.isString()
    ], async (request, response) => await BookController.get(request, response))

    router.post('/books', [
        body('title').notEmpty().isString()
        // TODO: Finir la validation
    ], [
        async (request, response, next) => Auth(request, response, next),
        async (request, response, next) => FileManager(request, response, next)
    ], async (request, response) => await BookController.store(request, response))

    router.put('/books/:id', [
        // TODO: Finir la validation
    ], [
        async (request, response, next) => Auth(request, response, next),
        async (request, response, next) => FileManager(request, response, next)
    ], async (request, response) => await BookController.update(request, response))

    router.delete('/books/:id', [
        // TODO: Finir la validation
    ], [ async (request, response, next) => Auth(request, response, next) ],
    async (request, response) => await BookController.destroy(request, response))

    router.post('books/:id/rating', [
        param('id').isNumeric().notEmpty(),
        
    ], [ async (request, response, next) => Auth(request, response, next) ],
    async (request, response) => await BookController.rating(request, response))

    webServer.use('/api/', router)
    webServer.listen(port, () => console.log(`API Listen on port ${port}`))
}