const express = require('express')
const dotenv = require('dotenv').config()
const userController = require('../controllers/user')
const questionController = require('../controllers/questions')
const {upload} = require('../utils/cloudinary')
const path = require('path')



const route = express.Router()

// route for user's controller
route.post('/user', userController.createUser)
route.post('/login', userController.loginUser)
route.put('/user/:id', userController.updateUser)
route.get('/test', userController.testUser)



//route for question controller
route.post('/question', upload.single('image'), questionController.createQuestions)
route.get('/questions', questionController.getQuestions)
route.delete('/question/:id', questionController.deleteExamQuestion)
route.get('/question/type', questionController.getByExamType)
route.get('/question/subject', questionController.getQuestionBySubject)
route.get('/question/topic', questionController.getQuestionByTopic)
route.put('/question/:id', upload.single('image'), questionController.updateQuestion)
route.put('/question/:subject/:topic', questionController.updateByTopic)
route.delete('/question/:subject/:topic', questionController.deleteByTopic)

module.exports = route
