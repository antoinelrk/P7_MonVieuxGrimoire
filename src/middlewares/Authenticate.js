const _init = (request, response, next) => {
    console.log(`Middleware d'auth`);
    next()
}

export default {
    _init
}