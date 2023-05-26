import mongoose from "mongoose"

const connect = (options) => {
    try {
        mongoose.connect(`mongodb+srv://${options.username}:${options.password}@${options.host}/?retryWrites=true&w=majority`)
        return mongoose
    } catch (err) {
        console.log(err)
        process.exit(0)
    }
}

export default {
    connect
}