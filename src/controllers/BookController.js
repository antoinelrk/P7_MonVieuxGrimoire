import Book from '../models/Book.js'
import Validator from '../core/Validator.js'
import App from '../app.js'
import { storeFile, removeFile } from '../core/Helper.js'

const get = async (request, response) => {
   if (request.params.hasOwnProperty('id') && request.params.id.length === 24) {
      const currentBook = await Book.get().find({ _id: request.params.id })
         .then(data => data[0])
         .catch((error) => {
            console.log(error)
         })

      if (currentBook !== undefined) {
         response.status(200)
         response.send(currentBook)
      } else {
         response.status(404)
         response.send({
            errors: [ `Le livre ${request.params.id} n'existe pas` ]
         })
      }
   } else {
      response.status(422)
      response.send({
         errors: [
            `L'ID du livre est requis`,
            `L'ID du livre doit être égal à 24 caratères`
         ]
      })
   }
}

const list = async (request, response) => {
   let books

   if (request.path.split(`/`).pop() === `bestrating`) {
      books = await Book.get()
         .find({})
         .sort({ averageRating: 1 })
         .limit(3)
         .then(books => books)
   } else {
      books = await Book.get()
         .find({})
         .then(books => books)
   }

   response.status(200)
   response.send(books)
}

const store = async (request, response) => {
   /**
    * On créé le nouveau livre et on le stocke en DB
    */

   let { validated, failed } = Validator.parseBody(request, [
      ['image', "file:image"],
      ['author', "string"],
      ['title', "string"],
      ['genre', "string"]
   ])

   if (failed.length > 0) {
      response.status(422)
      response.send({
         errors: failed
      })
   } else {
      const bodyRequestBook = JSON.parse(request.body.book)

      const imageToUpload = request.file
      const payload = {
         ...bodyRequestBook,
         ...{imageUrl: `/`},
         ...{imageUri: `/`},
         ...{averageRating: bodyRequestBook.ratings[0].grade}
      }

      const book = new (Book.get())(payload)
      const imageName = `${book.id}.${request.file.mimetype.split(`/`).pop()}`

      book.imageUrl = `${App.getEnv().API_URL}uploads/${imageName}`
      book.imageUri = `/uploads/${imageName}`

      delete payload.image

      try {
         const payload = await Book.save(book)
         if (payload.status === 201) {
            storeFile(imageToUpload, `uploads`, `${imageName}`)
            response.status(payload.status)
            response.send({book})
         } else {
            response.status(payload.status)
            response.send(payload.data)
         }

      } catch (err) {
         console.log(err)
         response.status(500)
         response.send({err})
      }
   }
}

const update = async (request, response) => {
   if (request.params.hasOwnProperty('id') && request.params.id.length === 24) {
      const body = JSON.parse(request.body.book)
      let payload = {...body}
      let imageName = ``

      if (request.file) {
         imageName = `${request.params.id}.${request.file.mimetype.split(`/`).pop()}`
         payload = {
            ...body,
            ...{ imageUrl: `${App.getEnv().API_URL}uploads/${imageName}` },
            ...{ imageUri: `/uploads/${imageName}` }
         }
      }

      await Book.get().findOneAndUpdate({ _id: request.params.id }, payload, { new: true })
         .then((updatedBook) => {
            if (request.file) {
               storeFile(request.file, `uploads`, `${imageName}`)
            }

            response.status(200)
            response.send(`Le livre ${updatedBook.id} a bien été modifié`)
         })
         .catch((error) => {
            console.log(error)
            response.status(500)
            response.send(`bonjour`)
         })
   } else {
      response.status(422)
      response.send(`L'ID du livre est requis`)
   }
}

const destroy = async (request, response) => {
    if (request.params.hasOwnProperty('id') && request.params.id.length === 24) {
        await Book.get().findOneAndRemove({ _id: request.params.id })
            .then(result => {
                console.log('Entrée supprimée avec succès :', result);
                removeFile(result.imageUri)
            })
            .catch(err => {
                console.error('Erreur lors de la suppression de l\'entrée :', err);
            });
    
        response.status(200)
        response.send({
            message: `Le livre ${request.params.id} à bien été supprimé`
        })
    } else {
        response.status(422)
        response.send(`L'ID du livre est requis`)
    }
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