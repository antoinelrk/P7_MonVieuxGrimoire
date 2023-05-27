const _init = (request, response, next) => {
    console.log(`Middleware d'auth`);
    next(request, response)
}

export default {
    _init
}