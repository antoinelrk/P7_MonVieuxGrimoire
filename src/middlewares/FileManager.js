import multer from "multer"

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
}

export const fileStorage = multer({ storage: multer.memoryStorage(), dest: 'uploads/' }).single('image')

export default async (request, response, next) => {
    fileStorage (request, response, async (error) => {
        next()
    })
}

// const storage = multer.diskStorage({
//     destination: (request, file, cb) => {
//         // Spécifiez ici le répertoire de destination où vous souhaitez enregistrer les fichiers
//         cb(null, 'uploads/');
//     },
//     filename: (request, file, cb) => {
//         // Générez un nom de fichier unique en utilisant la date actuelle et l'extension du fichier d'origine
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         // const book = JSON.parse(request.body.book)
//         cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
//     }
// })