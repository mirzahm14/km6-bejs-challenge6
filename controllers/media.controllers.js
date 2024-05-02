const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const imagekit = require('../libs/imagekit')
const path = require('path')
const { error } = require('console')

module.exports = {
    upload: async (req, res) => {
        try {
            if(!req.file){
                return res.status(400).json({
                    status: false,
                    message: 'no image',
                    error: 'There is no image to upload',
                    data: null
                })
            }

            const { title, description } = req.body
            if(!title || !description){
                return res.status(400).json({
                    status: false,
                    message: 'All fields is required',
                    error: 'Title or Description is blank!',
                    data: null
                })
            }

            const strFile = req.file.buffer.toString('base64')

            let {fileId, url} = await imagekit.upload({
                fileName: Date.now() + path.extname(req.file.originalname),
                file: strFile
            })

            if(!url){
                return res.status(400).json({
                    status: false,
                    message: 'Failed',
                    error: 'Image kit upload failed',
                    data: null
                })
            }

            const result = await prisma.images.create({
                data: {
                    title,
                    description,
                    imageUrl: url,
                    imagekitId: fileId
                }
            })

            if(!result){
                return res.status(400).json({
                    status: false,
                    message: 'Failed',
                    error: 'Media failed to create',
                    data: null
                })
            }

            delete result.imagekitId

            return res.status(201).json({
                status: true,
                message: 'Created',
                error: null,
                data: {...result}
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                status: false,
                message: 'Internal server error',
                error: err.message,
                data: null
            })
        }
    },

    getAllImages: async (req, res) => {
        try {
            const result = await prisma.images.findMany({orderBy: {id: 'asc'}})

            if(!result || result.length === 0){
                return res.status(400).json({
                    status: false,
                    message: 'Failed',
                    error: 'There is no data in database',
                    data: null
                })
            }
    
            return res.status(200).json({
                status: true,
                message: 'Success',
                error: null,
                data: result
            })
        } catch (err) {
            res.status(500).json({
                status: false,
                message: 'Internal server error',
                error: err.message,
                data: null
            })
        }
    },

    getImage: async (req,res) => {
        try {
            const id = +req.params.id
            const result = await prisma.images.findUnique({where: {id}})

            if(!result){
                return res.status(400).json({
                    status: false,
                    message: 'Failed',
                    error: 'Wrong ID',
                    data: null
                })
            }

            return res.status(200).json({
                status: true,
                message: 'Success',
                error: null,
                data: result
            })
        } catch (err) {
            res.status(500).json({
                status: false,
                message: 'Internal server error',
                error: err.message,
                data: null
            })
        }
    },

    updateImage: async (req,res) => {
        try {
            const id = +req.params.id

            //Avoid sending empty fields
            const updateData = {}
            if(req.body.title && req.body.title !== ''){
                updateData.title = req.body.title
            }
            if(req.body.description && req.body.description !== ''){
                updateData.description = req.body.description
            }
            console.log(updateData)
            if(!Object.keys(updateData).length){
                return res.status(400).json({
                    status: false,
                    message: 'No Changes',
                    error: 'There is no data to update',
                    data: null
                })
            }

            const result = await prisma.images.update({
                where: {id},
                data: {
                    ...updateData
                }
            })

            if(!result){
                return res.status(400).json({
                    status: false,
                    message: 'Failed',
                    error: 'Wrong ID',
                    data: null
                })
            }

            return res.status(200).json({
                status: true,
                message: 'Updated',
                error: null,
                data: result
            })
        } catch (err) {
            res.status(500).json({
                status: false,
                message: 'Internal server error',
                error: err.message,
                data: null
            })
        }
    },

    deleteImage: async (req,res) => {
        try {
            const id = +req.params.id
            const data = await prisma.images.findUnique({where: {id}})

            if(!data){
                return res.status(400).json({
                    status: false,
                    message: 'Failed',
                    error: 'Wrong ID',
                    data: null
                })
            }

            imagekit.deleteFile(data.imagekitId, (err, result) => {
                if(err){
                    return res.status(400).json({
                        status: false,
                        message: 'Failed',
                        error: err.message,
                        data: null
                    })
                }
            })
            const result = await prisma.images.delete({where: {id}})

            return res.status(200).json({
                status: true,
                message: 'Deleted',
                error: null,
                data: result
            })
        } catch (err) {
            res.status(500).json({
                status: false,
                message: 'Internal server error',
                error: err.message,
                data: null
            })
        }
    }
}