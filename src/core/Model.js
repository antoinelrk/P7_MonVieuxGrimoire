import fs from 'fs'

const initialize = (db) => {
    const modelsFiles = fs.readdirSync(`${process.cwd()}/src/models`)
    modelsFiles.map(async (file) => {
        if (file.endsWith('.js')) {
            await import (`../models/${file}`).then(module => module.default._init(db))
        }
    })

    console.log(`${modelsFiles.length} models loaded`)
}

export default {
    initialize
}