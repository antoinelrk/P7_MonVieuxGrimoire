import jwt from 'jsonwebtoken'
import App from '../app.js' 

const generateJwt = (user, options = null) => {
    const token = jwt.sign(user, App.getEnv().JWT_SECRET, {
        expiresIn: `${App.getEnv().JWT_REFRESH_TTL}m`
    })

    if (options?.withRefresh) {
        const refreshToken = jwt.sign(user, App.getEnv().JWT_SECRET, {
            expiresIn: `${App.getEnv().JWT_REFRESH_TTL}m`
        })
        return {
            token: token,
            refresh: refreshToken
        }
    } else {
        return {
            token: token
        }
    }
}
const verifyJwt = () => {}

export default {
    generateJwt,
    verifyJwt
}