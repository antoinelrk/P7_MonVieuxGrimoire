import Jwt from '../core/Jwt.js'

export default (request, response, next) => {
    if (request.headers.hasOwnProperty('authorization')) {
        const decodedToken = Jwt.verifyJwt(request.headers.authorization.split(" ")[1])
        if (decodedToken !== null) {
            response.status(403)
            response.send({
                message: `Vous êtes déjà connecté`
            })
            return;
        }
        next()
    } else {
        next()
    }
}