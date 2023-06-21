import User from "../models/User"

const remove = async (request, response) => {
    const currentUser = await User.get().find({ _id: request.params.id })
    .then(data => data[0])
    .catch((error) => {
       console.log(error)
    })
 
    if (currentUser.id === request.user.userId) {
        await User.get().findOneAndRemove({ _id: request.params.id })
        .then().catch(err => {
            console.error('Erreur lors de la suppression de l\'entrée :', err);
        });

        response.status(200)
        response.send({
        message: `L'utilisateur ${request.params.id} à bien été supprimé`
        })
    } else {
        response.status(403)
        response.send({
        message: `Vous n'avez pas l'autorisation de supprimer des utilisateurs`
        })
    }
}

export default {
    remove
}