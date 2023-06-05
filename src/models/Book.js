import { Schema } from "mongoose"
import mongooseUniqueValidator from "mongoose-unique-validator"

let Model

const _init = (db) => {
    const schema = new Schema({
        userId: {
            type: String
        },
        title: {
            type: String,
            required: [true, `The book exist`],
            unique: true
        },
        author: {
            type: String
        },
        imageUri: {
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
                    type: String,
                    // unique: true
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

    schema.index({
        userId: 1,
        ratings: [
            {
                userId: 1,
                grade: 1 
            }
        ]}, { unique: true });
    schema.plugin(mongooseUniqueValidator)
    Model = db.model(`${import.meta.url.split('/').pop().split('.').shift()}`, schema)
}

const save = async (book) => {
    let payload = {
        status: 500,
        data: {
            message: `internal`
        }
    }
    try {
        await book.save()
        payload = {
            data: {
                message: `Le livre est bien enregistré`,
            },
            status: 201
        }
    } catch (error) {
        payload = {
            data: {
                message: `${error}`
            },
            status: 422
        }
    }
    
    return payload
}

const get = () => Model

export default {
    _init,
    save,
    get
}