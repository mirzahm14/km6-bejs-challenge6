require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const Router = require('./routes/index')
app.use('/api/v1/', Router)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})