export default [
    [
        `POST`,
        `/auth/signup`,
        [],
        async (request, response) =>
            await import (`./controllers/AuthController.js`)
                .then(module => module.default.signup(request, response))
    ],
    [
        `POST`,
        `/auth/login`,
        ['guest'],
        async (request, response) =>
            await import (`./controllers/AuthController.js`)
                .then(module => module.default.login(request, response))
    ],
    [
        'GET',
        "/books/",
        [],
        async (request, response) =>
            await import (`./controllers/BookController.js`)
                .then(module => module.default.list(request, response))
    ],
    [
        'GET',
        "/books/bestrating",
        [],
        async (request, response) =>
            await import (`./controllers/BookController.js`)
                .then(module => module.default.list(request, response))
    ],
    [
        'GET',
        "/books/:id",
        [],
        async (request, response) =>
            await import (`./controllers/BookController.js`)
                .then(module => module.default.get(request, response))
    ],
    [
        'POST',
        "/books",
        ['auth', 'filemanager'],
        async (request, response) =>
            await import (`./controllers/BookController.js`)
                .then(module => module.default.store(request, response))
    ],
    [
        'PATCH',
        "/books/:id",
        ['auth'],
        async (request, response) =>
            await import (`./controllers/BookController.js`)
                .then(module => module.default.update(request, response))
    ],
    [
        'DELETE',
        "/books/:id",
        ['auth'],
        async (request, response) =>
            await import (`./controllers/BookController.js`)
                .then(module => module.default.destroy(request, response))
    ],
    [
        'POST',
        "/books/:id/rating",
        ['auth'],
        async (request, response) => 
            await import (`./controllers/BookController.js`)
                .then(module => module.default.rating(request, response))
    ]
]