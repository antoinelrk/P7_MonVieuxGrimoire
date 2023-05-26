export default [
    ['GET', "/", async (request, response) => await import(`./controllers/PageController.js`).then(module => module.default.index(request, response))],
    ['POST', "/users", async (request, response) => await import(`./controllers/UserController.js`).then(module => module.default.users(request, response))]
]