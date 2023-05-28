import User from '../models/User.js'
import Hash from '../core/Hash.js'
import Jwt from '../core/Jwt.js'

const signup = async (request, response) => {
    const payload = {
        email: request.body.email,
        password: await Hash.make(request.body.password)
    }

    const user = new (User.get())(payload);

    const dbResponse = await User.saveUser(user)

    response.status(dbResponse.status)
    response.send(dbResponse.data)
}

const login = async (request, response) => {
    const user = await User.get().findOne({ email: request.body.email })
    let statusCode
    let data

    if (user !== null) {
        if (await Hash.verify(user.password, request.body.password)) {
            const jwtData = Jwt.generateJwt({
                email: user.email
            }, {
                withRefresh: true
            })
            response.setHeader("Bearer", `${jwtData.token}`)
            statusCode = 200
            data = {
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
        statusCode = 400
        data = {
            message: `L'email n'existe pas`
        }
    }

    response.status(statusCode)
    response.send(data)
}

export default {
    signup,
    login
}