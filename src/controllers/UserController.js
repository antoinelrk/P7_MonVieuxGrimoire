import App from '../app.js'

const users = (request, response) => {
    console.log(response)
}

const test = (request, response, next) => {
    return response.send('okok')
}

export default {
    users,
    test
}