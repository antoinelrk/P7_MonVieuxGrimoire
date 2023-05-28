import fs from 'fs'

const arrayOfMiddlewares = []

const initialize = async () => {
    const middlewaresList = fs.readdirSync(`${process.cwd()}/src/middlewares`)
    middlewaresList.map(async (file) => {
        if (file.endsWith('.js')) {
            arrayOfMiddlewares.push({
                key: file.split('.')[0].toLowerCase(),
                on: async (request, response, next) => await import (`../middlewares/${file}`).then(module => module.default(request, response, next))
            })
        }
    })

    console.log(`${middlewaresList.length} middlewares loaded`)
    return arrayOfMiddlewares
}

export default {
    initialize
}