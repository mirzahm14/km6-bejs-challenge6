const Router = require('express').Router()
const prisma = require('@prisma/client')
const { upload, getAllImages, getImage, updateImage, deleteImage } = require('../controllers/media.controllers')

//middlewares
const {image} = require('../libs/multer')

Router.post('/', image.single('image'), upload)
Router.get('/', getAllImages)
Router.get('/:id', getImage)
Router.put('/:id',image.any(), updateImage) //multer used for multipart form like form-data
Router.delete('/:id', deleteImage)

module.exports = Router