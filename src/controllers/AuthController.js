import User from '../models/User.js'
import Hash from '../core/Hash.js'
import Jwt from '../core/Jwt.js'
import { validationResult } from 'express-validator'

const signup = async (request, response) => {
    const errors = validationResult(request)
    console.log(errors)
    return 
    const dbResponse = await User.saveUser(new (User.get())({
        email: request.body.email,
        password: await Hash.make(request.body.password)
    }))
    response.status(dbResponse.status)
    response.send(dbResponse.data)
}

const login = async (request, response) => {
    let statusCode
    let data
    const errors = validationResult(request)
    if (errors) {
        statusCode = 422
        data = {
            message: errors
        }
        return
    } else {
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
        response.status(statusCode)
        response.send(data)
    }
}

export default {
    signup,
    login
}