import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.APP_PORT
const app = express()

app.use(cors())

app.get('/', (request, response) => {
    response.send(`MonVieuwGrimoire API`)
})

app.listen(PORT, () => {
    console.log(`API Listen on port ${PORT}`)
})
