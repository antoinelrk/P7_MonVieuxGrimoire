import Book from '../models/Book.js'
import Validator from '../core/Validator.js'
import App from '../app.js'

const get = async (request, response) => {
   let book = null

   if (request.params.hasOwnProperty('id') && request.params.id.length === 24) {
      const currentBook = await Book.get().find({ _id: request.params.id })
         .then(data => data[0])
         .catch((error) => {
            console.log(error)
         })

      if (currentBook !== null) {
         response.status(200)
         book = currentBook
      }
   } else {
      response.status(422)
      book = null
   }

   response.send(book)
}

const list = async (request, response) => {
   let books

   if (request.path.split(`/`).pop() === `bestrating`) {
      books = await Book.get().find({}).sort({ averageRating: 1 }).limit(3).then(books => books)
   } else {
      books = await Book.get().find({}).then(books => books)
   }

   response.status(200)
   response.send(Array.from(books))
}

const store = async (request, response) => {
   // const { validated, failed } = Validator.parseBody(request.body, [
   //    ['image', "file:image"],
   //    ['author', "string|between:8,64"],
   //    ['title', "string|between:8,64"],
   //    ['genre', "string|between:8,64"],
   // ])

   // console.log(validated);
   // console.log(failed);

   let data = JSON.parse(request.body.book)

   const book = new (Book.get())({ ...data, imageUrl: `${App.getEnv().API_URL}${request.file.path}`
   })

   console.log(book)

   try {
      await Book.save(book)
   } catch (err) {
      console.log(err)
   }

   response.status(200)
   response.send({
      message: `ok`
   })

   // console.log(request.user)
   // const payload = {
   //    userId: request.user.userId,
   //    title: request.body.title,
   //    author: request.body.author,
   //    genre: request.body.genre,
   //    rating: [],
   //    averageRating: 0
   // }
   // const newBook = new (Book.get())(payload)
   
   // const dbResponse = await Book.save(newBook)

   // response.status(dbResponse.status)
   // response.send(dbResponse.data)
}

const update = async (request, response) => {
   let currentBook = await Book.get().find({ _id: request.params.id }).then(data => data)
   response.send({
      message: currentBook,
      status: 200
   })
}

const destroy = (request, response) => {
   response.send({
      message: `message`,
      status: 200
   })
}

const rating = async (request, response) => {
   let currentBook = await Book.get().find({ _id: request.params.id }).then(data => data[0])
   let userRating = request.body.rating

   if (currentBook.ratings.some(rating => rating.userId === request.body.userId)) {
      response.status(422)
      response.send({
         message: `Vous avez déjà noté ce livre!`
      })
      return
   }

   if (userRating > 5) {
      response.status(422)
      response.send({
         message: `La note ne peut être au dessus de 5`
      })
      return
   }

   let allRatingNumbers = userRating
   await currentBook.ratings.map(rating => allRatingNumbers += rating.grade)
   let newAverageNote = allRatingNumbers / (currentBook.ratings.length + 1)

   Book.get().findOneAndUpdate({ _id: request.params.id }, {
      ratings: [
         ...currentBook.ratings,
         {
            userId: request.body.userId,
            grade: userRating
         }
      ],
      averageRating: newAverageNote
   }, {new: true}).then(result => {
      response.status(200)
      response.send(result)
    })
    .catch(error => {
      response.status(500)
      response.send(error)
    });
}

export default {
   get,
   list,
   store,
   update,
   destroy,
   rating
}