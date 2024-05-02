const Router = require('express').Router()
const mediaRouter = require('./media.router')

Router.get('/', (req, res) => {res.status(200).json({
    status: true,
    message: "OK!",
    error: null,
    data: null
})})

Router.use('/media', mediaRouter)

module.exports = Router