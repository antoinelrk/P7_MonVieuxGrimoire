import mongoose from "mongoose"

const connect = (options) => {
    try {
        mongoose.connect(`mongodb+srv://${options.username}:${options.password}@${options.host}/${options.dbName}`)
        return mongoose
    } catch (err) {
        console.log(err)
        process.exit(0)
    }
}

export default {
    connect
}