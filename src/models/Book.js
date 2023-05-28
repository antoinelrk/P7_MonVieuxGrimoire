import { Schema } from "mongoose"

let Model

const _init = (db) => {
    const schema = new Schema({
        userId: {
            type: String
        },
        title: {
            type: String
        },
        author: {
            type: String
        },
        imageUrl: {
            type: String
        },
        year: {
            type: Number
        },
        genre: {
            type: String
        },
        ratings: [
            {
                userId: {
                    type: String
                },
                grade: {
                    type: Number
                }
            }
        ],
        averageRating: {
            type: Number
        }
    })
    Model = db.model(`${import.meta.url.split('/').pop().split('.').shift()}`, schema)
    Model.createCollection()
}

const get = () => Model

export default {
    _init,
    get
}