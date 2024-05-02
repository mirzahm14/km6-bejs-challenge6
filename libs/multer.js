const multer = require('multer')

function generateFilter(props){
    const { allowedMimeTypes, maxFileSize } = props

    return multer({
        fileFilter: (req, file, callback) => {
            if(!allowedMimeTypes.includes(file.mimetype)){
                const err = new Error(`Only ${allowedMimeTypes.join(', ')} allowed to upload!`)
                return callback(err, false)
            }

            const fileSize = parseInt(req.headers['content-length'])
            if(fileSize > maxFileSize){
                const err = new Error(`Maximum file size is ${maxFileSize/1000000} MB!`)
                return callback(err, false)
            }

            callback(null, true)
        },
        
        onError: (err, next) => {
            next(err.message)
        }
    })
}

module.exports = {
    image: generateFilter({
        allowedMimeTypes: ['image/png', 'image/jpeg'],
        maxFileSize: 5000000
    })
}