const cloudinary = require("cloudinary").v2
const multer = require("multer")
const dotenv = require('dotenv').config()
const path = require("path")


const upload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb)=>{
        checkFileType(file, cb)
    }
})

const checkFileType =(file, cb)=>{
    const filetypes = /jpeg|jpg|png|gif|avif/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if(mimetype && extname){
        return cb(null, true)
    }else{
        cb('Images Only!!')
    }
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

module.exports = {cloudinary, upload}