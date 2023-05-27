import fs from 'fs'

const initialize = (webServer) => {
    const middlewaresList = fs.readdirSync(`${process.cwd()}/src/middlewares`)
    middlewaresList.map(async (file) => {
        if (file.endsWith('.js')) {
            webServer.use(async (request, response, next) => await import (`../middlewares/${file}`).then(module => module.default._init(request, response, next)))
        }
    })

    console.log(`${middlewaresList.length} middlewares loaded`)
}

export default {
    initialize
}