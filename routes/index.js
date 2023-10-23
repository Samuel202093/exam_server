const express = require('express')
const dotenv = require('dotenv').config()
const userController = require('../controllers/user')
const authController = require('../controllers/auth')
const questionController = require('../controllers/questions')
const {upload} = require('../utils/cloudinary')
const path = require('path')



const route = express.Router()

// route for user's controller
route.post('/signup', userController.signUp)
route.post('/login', userController.login)



//route for question controller
route.post('/question', authController.protect, upload.single('image'), questionController.createQuestions)
route.get('/questions', questionController.getQuestions)
route.delete('/question/:id', authController.protect, authController.restrictedTo('admin', 'team-lead'), questionController.deleteExamQuestion)
route.get('/question/type', questionController.getByExamType)
route.get('/question/subject', questionController.getQuestionBySubject)
route.get('/question/topic', questionController.getQuestionByTopic)
route.put('/question/:id', authController.protect, upload.single('image'), questionController.updateQuestion)
route.put('/question/:subject/:topic', authController.protect, questionController.updateByTopic)
route.delete('/question/:subject/:topic', authController.protect, authController.restrictedTo('admin', 'team-lead'), questionController.deleteByTopic)

module.exports = route
