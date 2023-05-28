import { Schema } from "mongoose"

let Model

const _init = (db) => {
    const schema = new Schema({
        email: {
            type: String,
            required: [true, `Email must be required`],
            unique: true
        },
        password: {
            type: String,
            required: [true, `Really? You don't need a password?`],
            min: [8, `Your password is too few`],
            max: [64, `Too much security kills security`]
        }
    }, {
        autoCreate: false,
        autoIndex: false
    })

    Model = db.model(`${import.meta.url.split('/').pop().split('.').shift()}`, schema)
    Model.createCollection()
    /**
     * TODO: Essayer avec le plugin `mongoose-unique-validator`
     */
    Model.collection.createIndex({
        "email": 1
    }, {
        unique: true
    })
}

const get = () => Model

const saveUser = async (user) => {
    let payload
    try {
        await user.save()
        payload = {
            data: {
                message: `Vous êtes bien enregistré`,
            },
            status: 201
        }
    } catch (error) {
        switch (error.code) {
            case 11000:
                payload = {
                    data: {
                        message: `L'email est déjà utilisé`,
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

export default {
    _init,
    get,
    saveUser
}