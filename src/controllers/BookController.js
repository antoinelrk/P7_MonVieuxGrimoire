import Book from '../models/Book.js'

const get = (request, response) => {
 response.send({
    message: `message`,
    status: 200
 })
}

const list = (request, response) => {
   let data = `books`
   if (request.path.split(`/`).pop() === `bestrating`) {
      data += `-bestrating`
   }
   response.send({
      data: data,
      status: 200
   })
}

const store = (request, response) => {
 response.send({
    message: `message`,
    status: 200
 })
}

const update = (request, response) => {
 response.send({
    message: `message`,
    status: 200
 })
}

const destroy = (request, response) => {
 response.send({
    message: `message`,
    status: 200
 })
}

export default {
    get,
    list,
    store,
    update,
    destroy
}