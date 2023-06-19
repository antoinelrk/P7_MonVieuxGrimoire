import User from '../models/User.js'
import Hash from '../core/Hash.js'
import Jwt from '../core/Jwt.js'
import { validationResult } from 'express-validator'

const signup = async (request, response) => {
    const errors = validationResult(request)
    if (errors.isEmpty()) {
        const dbResponse = await User.saveUser(new (User.get())({
            email: request.body.email,
            password: await Hash.make(request.body.password)
        }))
        response.status(dbResponse.status)
        response.send(dbResponse.data)
    } else {
        response.status(422)
        response.send(errors)
    }
}

const login = async (request, response) => {
    const errors = validationResult(request)
    let statusCode
    let data
    if (errors.isEmpty()) {
        const user = await User.get().findOne({ email: request.body.email })

        if (await Hash.verify(user.password, request.body.password)) {
            const jwtData = Jwt.generateJwt({
                userId: user._id.toString(),
                email: user.email
            }, {
                withRefresh: true
            })
            response.setHeader("Bearer", `${jwtData.token}`)
            statusCode = 200
            data = {
                userId: user._id.toString(),
                token: `${jwtData.token}`
            }
            // response.cookie(`token`, jwtData.token, { maxAge: App.getEnv().JWT_TTL })
            // response.cookie(`refresh_token`, jwtData.token, { maxAge: App.getEnv().JWT_TTL })
        } else {
            statusCode = 400
            data = {
                message: `Mot de passe incorrect`
            }
        }
    } else {
        statusCode = 422
        data = errors
        return
    }

    response.status(statusCode)
    response.send(data)
}

export default {
    signup,
    login
}