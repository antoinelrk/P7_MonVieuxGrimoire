import fs from 'fs'

const initialize = (db) => {
    fs.readdirSync(`${process.cwd()}/src/models`).map(async (file) => {
        if (file.endsWith('.js')) {
            // Importer les models ici et les "run" avec mongoose
            await import (`../models/${file}`).then(module => module.default._init(db))
        }
    })
}

export default {
    initialize
}