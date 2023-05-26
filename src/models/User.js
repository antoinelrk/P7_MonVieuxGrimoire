import path from 'path'

let Model

const _init = (db) => {
    Model = db.model(`${import.meta.url.split('/').pop().split('.').shift()}`, {
        name: String,
    })
}

const get = () => Model

export default {
    _init,
    get
}