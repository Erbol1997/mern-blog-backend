import express from "express";
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors'

import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";

import { handleValidationErrors, checkAuth } from "./utils/index.js";

import { UserController, PostController } from "./controllers/index.js";

mongoose
    .connect('mongodb+srv://erbol:erbol1297@cluster0.egptyh6.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB Ok'))
    .catch((e) => console.log('Db error', e))

const app = express()
app.use(cors())

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage })

app.use('/uploads', express.static('uploads'))

app.use(express.json())

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

app.listen(4444, (err) => {
    if(err) {
        return console.log(err)
    }

    console.log('server ok')
})