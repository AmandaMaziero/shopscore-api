const cors = require("cors")
const express = require("express")
const morgan = require("morgan")
const swaggerUi = require('swagger-ui-express')

const db = require("./models")
const routes = require("./routes")
const swaggerFile = require('./swagger.json')

require("dotenv").config()

const port = process.env.PORT ? process.env.PORT : 3000
const url = process.env.URL_SITE ? `${process.env.URL_SITE}:${port}` : `http://localhost:${port}`

const app = express()

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))
app.use(morgan("common"))

const optionsSwagger = {
    swaggerOptions: {
        docExpansion: "none"
    }
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile, optionsSwagger))

app.get('/', (_, response) => {
    response.status(200).json({ success: true, message: "API da ShopScore na área, faça a sua requisição! 😜🫶" })
})

app.use(cors());
routes(app)

app.listen(port, async () => {
    try {
        await db.sequelize.authenticate()
        console.log(`Banco de dados a postos! 🫡`)
        console.log(`Api em execução na url: ${url} 🥳`)
    } catch (error) {
        console.log(`Algo deu errado: ${error}`)
    }
})