import { MongoClient, ServerApiVersion } from "mongodb"

export default class Database {
    constructor(options) {
        this.client = this.createClient(options)
        this.dbName = options.dbName
    }

    createClient(options) {
        const uri = `mongodb+srv://${options.username}:${options.password}@${options.host}/?retryWrites=true&w=majority`
        return new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
    }

    getClient() {
        return this.client
    }

    getDatabase() {
        return this.client.db(this.dbName)
    }
}