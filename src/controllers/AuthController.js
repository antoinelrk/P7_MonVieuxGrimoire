const signup = (request, response) => {
    /**
     * Importer le model et enregistrer l'utilisateur si il n'existe pas
     */
    response.send({
        data: {
            message: `Vous êtes bien enregistrés`
        },
        status: 200
    })
}

const login = (request, response) => {
    /**
     * Importer le model et appliquer la recherche via la request
     */
    response.send({
        data: {
            userId: `userId`,
            token: ``,
        },
        status: 200
    })
}

export default {
    signup,
    login
}