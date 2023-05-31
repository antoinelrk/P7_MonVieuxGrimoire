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
                    unique: true
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

    schema.plugin(mongooseUniqueValidator)
    Model = db.model(`${import.meta.url.split('/').pop().split('.').shift()}`, schema)
}

const save = async (book) => {
    let payload 
    try {
        await book.save()
        payload = {
            data: {
                message: `Vous êtes bien enregistré`,
            },
            status: 201
        }
    } catch (error) {
        switch (error.errors.title.properties.type) {
            case "unique":
                payload = {
                    data: {
                        message: `${error.errors.title.properties.message}`,
                    },
                    status: 422
                }
                break;
            default:
                payload = {
                    data: {
                        message: `Internal server error`,
                    },
                    status: 500
                }
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