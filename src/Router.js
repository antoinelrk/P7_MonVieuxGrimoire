import express from 'express'
import { query, body, param } from 'express-validator'

import Auth from './middlewares/Auth.js'
import Guest from './middlewares/Guest.js'
import FileManager from './middlewares/FileManager.js'

import AuthController from './controllers/AuthController.js'
import BookController from './controllers/BookController.js'

import User from './models/User.js'
import Book from './models/Book.js'
import AccountController from './controllers/AccountController.js'

const router = express.Router()

export default function (webServer, port) {
    /**
     * Login
     */
    router.post('/auth/login', [
        body('email').notEmpty().isEmail().custom(async (value) => {
            const user = await User.get().findOne({ email: value })
            if (user === null) throw new Error(`L'email n'existe pas`)
        }),
        body('password').notEmpty(),
    ], [ async (request, response, next) => Guest(request, response, next) ],
    async (request, response) => await AuthController.login(request, response))

    /**
     * Register
     */
    router.post('/auth/signup', [
        body('email').notEmpty().isEmail().custom(async (value) => {
            const user = await User.get().findOne({ email: value })
            if (user) throw new Error(`Cet E-mail n'est pas disponible`)
        }),
        body('password').notEmpty().isStrongPassword()
    ], [ async (request, response, next) => Guest(request, response, next) ],
    async (request, response) => await AuthController.signup(request, response))

    /**
     * Account management
     */
    router.delete('/users/:id',
    [
        param('id').notEmpty().isString().custom(async (value) => {
            const user = await User.get().findOne({ _id: value })
            if (!user) throw new Error(`L'utilisateur n'existe pas`)
        })
    ],
    [ async (request, response, next) => Auth(request, response, next) ],
    async (request, response) => await AccountController.remove(request, response))
    /**
     * Book management
     */
    router.get('/books', async (request, response) => await BookController.list(request, response))
    router.get('/books/bestrating', async (request, response) => await BookController.list(request, response))
    router.get('/books/:id', [
        param('id').notEmpty().isString().custom(async (value) => {
            const book = await Book.get().findOne({ _id: value })
            if (!book) throw new Error(`Le livre ${value} n'existe pas`)
        })
    ], async (request, response) => await BookController.get(request, response))
    router.post('/books', [
        body('title').notEmpty().isString(),
        body('author').notEmpty().isString(),
        body('genre').notEmpty().isString(),
        body('year').notEmpty().isNumeric(),
        body('userId').notEmpty().isString().custom(async (value) => {
            const user = await User.get().findOne({ _id: value })
            if (!user) throw new Error(`L'utilisateur n'existe pas`)
        }),
        body('rating.userID').notEmpty().isString().custom(async (value) => {
            const user = await User.get().findOne({ _id: value })
            if (!user) throw new Error(`L'utilisateur n'existe pas`)
        }),
        body('rating.grade').notEmpty().isNumeric()
    ], [
        async (request, response, next) => Auth(request, response, next),
        async (request, response, next) => FileManager(request, response, next)
    ], async (request, response) => await BookController.store(request, response))
    router.put('/books/:id', [
        param('id').notEmpty().isString().custom(async (value) => {
            const book = await Book.get().findOne({ _id: value })
            if (!book) throw new Error(`Le livre ${value} n'existe pas`)
        }),
        body('title').isString().optional(),
        body('author').isString().optional(),
        body('genre').isString().optional(),
        body('year').isNumeric().optional()
    ], [
        async (request, response, next) => Auth(request, response, next),
        async (request, response, next) => FileManager(request, response, next)
    ], async (request, response) => await BookController.update(request, response))
    router.delete('/books/:id', [
        param('id').notEmpty().custom(async (value) => {
            const book = await Book.get().findOne({ _id: value })
            if (!book) throw new Error(`Le livre ${value} n'existe pas`)
        })
    ], [ async (request, response, next) => Auth(request, response, next) ],
    async (request, response) => await BookController.destroy(request, response))
    router.post('/books/:id/rating', [
        param('id').notEmpty().custom(async (value) => {
            const book = await Book.get().findOne({ _id: value })
            if (!book) throw new Error(`Le livre ${value} n'existe pas`)
        }),
    ], [ async (request, response, next) => Auth(request, response, next) ],
    async (request, response) => await BookController.rating(request, response))

    webServer.use('/api/', router)
    webServer.listen(port, () => console.log(`API Listen on port ${port}`))
}