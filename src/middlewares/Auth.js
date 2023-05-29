import Jwt from '../core/Jwt.js'

export default (request, response, next) => {
    const decodedToken = Jwt.verifyJwt(request.headers.authorization.split(" ")[1])
    if (decodedToken === null) {
        response.status(403)
        response.send({
            message: `Le token est invalide`
        })
        return;
    }
    request.user = {...{email: decodedToken.email}}

    next()
}