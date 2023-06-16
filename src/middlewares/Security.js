export default (request, response, next) => {
    response.setHeader('X-XSS-Protection', '1; mode=block')
    response.setHeader('Content-Security-Policy', "default-src 'self'")
    response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader('X-Frame-Options', 'SAMEORIGIN')
    response.setHeader('Referrer-Policy', 'same-origin')
    response.setHeader('Content-Type', 'application/octet-stream')
    next()
}