import multer from "multer"

const MIME_TYPES = [
    "image/jpg",
    "image/png",
    "image/jpeg",
    "image/webp"
]

export const fileStorage = multer({ storage: multer.memoryStorage(), dest: 'uploads/' }).single('image')

export default async (request, response, next) => {
    fileStorage (request, response, async (error) => {
        // console.log(request)
        let errors = []

        if (MIME_TYPES.includes(request.file.mimetype)) {
            if (request.file.size <= 1000000) {
                next()
                return
            } else {
                errors.push({
                    message: `Fichier trop lourd (${request.file.size} / 1000000)`
                })
            }
        } else {
            errors.push({
                message: `Fichier non pris en charge (${request.file.mimetype.split('/').pop()})`
            })
        }

        if (errors.length > 0) {
            response.status(422)
            response.send(errors)
            return
        }
    })
}