const db = require("../db/index");
const { cloudinary } = require("../utils/cloudinary");
const path = require("path");
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const knex = require('../db/db');


exports.createExamType = catchAsync(async(req, res, next)=>{
    const examType = req.body.examType

    if (!examType) {
        return next(new AppError("please select the required field!", 401))
    }
    const checkExamType = await knex('exam_type').where({type_of_exam: examType}).first()

    if (checkExamType) {
        return next(new AppError("Exam Type Already exist!", 409))
    }
    const result = await knex('exam_type').insert({type_of_exam: examType}, "*")  
    if (result) {
        res.status(201).json({
            status: 'success',
            data: result
        })
    }
})


exports.createTopicSubject = catchAsync(async(req, res, next)=>{
    const {subject, topic, examType} = req.body

    if (!subject || !topic || !examType) {
        return next(new AppError("please select the required field!", 401))
    }

    const checkExamType = await knex('exam_type').where({type_of_exam: examType}).first()
    const checkSubjectExist = await knex('subjects').where({subject_title: subject}).first()
    const checkTopicExist = await knex('topics').where({topic_title: topic}).first()

    if (checkExamType) {
      
        if (!checkSubjectExist && !checkTopicExist) {
            const subjectCreated = await knex('subjects').insert({subject_title: subject}, "id")
            
            const topicCreated = await knex('topics').insert({topic_title: topic, subject_id: JSON.stringify(subjectCreated[0].id)}, "id")

            const subjectExamType = await knex('subject_and_exam_type').insert({exam_id: checkExamType.id, subject_id: JSON.stringify(subjectCreated[0].id)})

            res.status(201).json({
                status: "success",
                data: {subjectCreated, topicCreated}
            })
        }

        if (checkSubjectExist && checkTopicExist) {
            const subjectExamType = await knex('subject_and_exam_type').insert({exam_id: checkExamType.id, subject_id: checkSubjectExist.id}, "*")

            res.status(201).json({
                status: "success",
                data: {subjectExamType}
            })

        }
        
    }

})


exports.examType = catchAsync(async(req, res, next)=>{
    const result = await knex('exam_type')
    if (result) {
        res.status(200).json({data: result})
    }
})



exports.getSubject = catchAsync(async(req, res, next)=>{
    const checkExamType = await knex('exam_type').where({type_of_exam: req.params.examType}).first()
    if (checkExamType) {
        const result = await knex.raw(`SELECT * FROM subject_and_exam_type INNER JOIN exam_type ON subject_and_exam_type.exam_id = exam_type.id INNER JOIN subjects ON subject_and_exam_type.subject_id = subjects.id WHERE exam_id = ${checkExamType.id}`)

        res.status(200).json({data: result.rows})
    }
})

exports.getTopicFromSubject = catchAsync(async(req, res, next)=>{
    const subjectParams = req.params.subject
    const subjectIdResult = await knex('subjects').where({subject_title: subjectParams})
    
    if(subjectIdResult[0]){
        
        const result = await knex('topics').where({subject_id: subjectIdResult[0].id})
        res.status(200).json({data: result})
    }
})


exports.createQuestion = catchAsync(async(req, res, next)=>{
    if (!req.file) {
        
        const checkExamType = await knex('exam_type').select().where({type_of_exam: req.body.examType}).first()

        const checkSubjectExists = await knex('subjects').select().where({subject_title: req.body.subject}).first()

        const checkTopicExists = await knex('topics').select().where({topic_title: req.body.topic}).first()

        if (!checkSubjectExists && !checkTopicExists && !checkExamType) {
            return next(new AppError("please select a subject, topic and examType for this question!", 404))
        }

        const result = await knex('exam_questions').insert({question: req.body.question, options: req.body.options, correctAnswer: req.body.answer, year: req.body.examYear, topic_id: JSON.stringify(Number(checkTopicExists.id)), subject_id: JSON.stringify(Number(checkSubjectExists.id)), exam_id: JSON.stringify(Number(checkExamType.id))}, "*")

        res.status(201).json({
            status: 'success',
            data: result[0]
        })

    }

    if (req.file) {
        const imgResult = await cloudinary.uploader.upload(req.file.path);

        const checkSubjectExists = await knex('subjects').select('id', 'subject_title').where({subject_title: req.body.subject}).first()

        const checkTopicExists = await knex('topics').select('id','topic_title').where({topic_title: req.body.topic}).first()

        const checkExamType = await knex('exam_type').select('id', 'type_of_exam').where({type_of_exam: req.body.examType}).first()

        if (!checkSubjectExists && !checkTopicExists && !checkExamType) {
            return next(new AppError("please select a subject, topic and examType for this question!", 404))
        }

        const result = await knex('exam_questions').insert({question: req.body.question, options: req.body.options, correctAnswer: req.body.answer, year: req.body.examYear, image_url: imgResult.secure_url, cloudinary_id: imgResult.public_id, topic_id: JSON.stringify(Number(checkTopicExists.id)), subject_id: JSON.stringify(Number(checkSubjectExists.id)), exam_id: JSON.stringify(Number(checkExamType.id))}, "*")

        res.status(201).json({
            status: 'success',
            data: result[0]
        })
    }
})


exports.getQuestions = catchAsync(async(req, res, next)=>{
    const result = await knex.raw("SELECT * FROM exam_questions INNER JOIN exam_type ON exam_questions.exam_id = exam_type.id INNER JOIN subjects ON exam_questions.subject_id = subjects.id INNER JOIN topics ON exam_questions.topic_id = topics.id")
    if (result) {
        res.status(200).json({
            status: 'success',
            data: result.rows
        })
    }
})


exports.questionByExamType = catchAsync(async(req, res, next)=>{

    const result = await knex.raw("SELECT exam_id AS Exam_Id, type_of_exam AS typeOfExam, COUNT(DISTINCT subject_title) AS No_of_subject, COUNT(question) AS No_of_questions FROM exam_questions INNER JOIN subjects ON exam_questions.subject_id = subjects.id INNER JOIN exam_type ON exam_questions.exam_id = exam_type.id GROUP BY type_of_exam, exam_id")
    if (result) {
        res.status(200).json({
            status: "success",
            data: result.rows
        })
    }
  
})


exports.QuestionBySubject = catchAsync(async(req, res, next)=>{
    const result = await knex.raw(
        "SELECT COUNT(question) AS No_of_questions, COUNT(DISTINCT topic_title) AS No_of_topic, subject_title AS subjects, STRING_AGG(DISTINCT type_of_exam, ',') AS Type_of_exam FROM exam_questions INNER JOIN subjects ON exam_questions.subject_id = subjects.id INNER JOIN topics ON exam_questions.topic_id = topics.id INNER JOIN exam_type ON exam_questions.exam_id = exam_type.id GROUP BY subject_title"
      );

    if (result) {
        res.status(200).json({
            status: 'success',
            data: result.rows
        })
    }

})


exports.questionByTopic = catchAsync(async(req, res, next)=>{
    const result = await knex.raw("SELECT subject_title AS subject, topic_title AS subject_topic, COUNT(question) AS No_of_questions FROM exam_questions INNER JOIN subjects ON exam_questions.subject_id = subjects.id INNER JOIN topics ON exam_questions.topic_id = topics.id GROUP BY subject_title, topic_title ")

    if (result) {
        res.status(200).json({
            status: 'success',
            data: result.rows
        })
    }
})


exports.deleteQuestionById = catchAsync(async(req, res, next)=>{
    const questionId = req.params.id
    const checkQuestion = await knex("exam_questions").where({id: questionId})

    if (!checkQuestion) {
        return next(new AppError("question does not exist!!!", 401))
    }


    if (!checkQuestion[0].cloudinary_id) {
        await knex('exam_questions').where({id: questionId}).del()
        res.status(204).json({
            status: "success",
            data: "question deleted successfully"
        })
    }

    if (checkQuestion[0].cloudinary_id) {
        await cloudinary.uploader.destroy(checkQuestion[0].cloudinary_id)
        await knex('exam_questions').where({id: questionId}).del()
        res.status(204).json({
            status: "success",
            data: "question deleted successfully"
        })
    }

   
})


exports.getQuestion = catchAsync(async(req, res, next)=>{

    const questionId = req.params.id

    // const checkQuestionExist = await knex('exam_questions').where({id: questionId})

    const checkQuestionExist = await knex.raw("SELECT * FROM exam_questions INNER JOIN exam_type ON exam_questions.exam_id = exam_type.id INNER JOIN subjects ON exam_questions.subject_id = subjects.id INNER JOIN topics ON exam_questions.topic_id = topics.id")

    if (!checkQuestionExist) {
    
        return next(new AppError("question does not exist!!!", 404))
    }else{

    res.status(200).json({
        status: "success",
        data: checkQuestionExist
    })
}
})


exports.updateQuestion = catchAsync(async(req, res, next)=>{

    const questionId = req.params.id

    if (!req.file) {
        const checkQuestionExist =  await knex('exam_questions').where({id: questionId})

        if (checkQuestionExist) {

            const checkType = await knex('exam_type').where({type_of_exam: req.body.examType})
            const checkSubject = await knex('subjects').where({subject_title: req.body.subject})
            const checkTopic = await knex('topics').where({topic_title: req.body.topic})

            if (checkType && checkSubject && checkTopic) {
            const result = await knex('exam_questions').where({id: req.params.id}).update({question: req.body.question, options: req.body.options, correctAnswer:req.body.answer, year:req.body.examYear}, "*")

            res.status(201).json({
                status: "success",
                data: result
            })
            }else{
                return next(new AppError("examType or Subject or Topic does not exist!!!", 404))
            }
        
        }else{
            return next(new AppError("question does not exist!!!", 404))
        }  
    }

    if (req.file) {
        const imgResult = await cloudinary.uploader.upload(req.file.path);
        const checkQuestionExist =  await knex('exam_questions').where({id: questionId}).first()
        if (checkQuestionExist) {
            if (JSON.stringify(checkQuestionExist.cloudinary_id)) {
                
                await cloudinary.uploader.destroy(JSON.stringify(checkQuestionExist.cloudinary_id))
                const checkType = await knex('exam_type').where({type_of_exam: req.body.examType})

                const checkSubject = await knex('subjects').where({subject_title: req.body.subject})
                const checkTopic = await knex('topics').where({topic_title: req.body.topic})

                if (checkType && checkSubject && checkTopic) {
                    const result = await knex('exam_questions').where({id: req.params.id}).update({question: req.body.question, options: req.body.options, correctAnswer:req.body.answer, year:req.body.examYear, image_url: imgResult.secure_url, cloudinary_id:imgResult.public_id}, "*")

                    res.status(201).json({
                        status: "success",
                        data: result
                    })
                }else{
                    return next(new AppError("Missing required field(s)!!!", 404)) 
                }
                
            }
        }else{
            return next(new AppError("question not found!!!", 404)) 
        }
        
    }

})


exports.updateByTopic = catchAsync(async(req, res, next)=>{
    const { topic, subjectID }= req.body
    const topicParams = req.params.topic
    
    if (!topic) {
        return next(new AppError("Missing required field!!!", 404))  
    }

    const checkTopicExist = await knex('topics').where({topic_title: topicParams}).first()

    if (!checkTopicExist) {
        return next(new AppError("topic not found!!!", 404)) 
    }

    const checkSubjectExist = await knex('subjects').where({id: checkTopicExist.subject_id}).first()

    if(!checkSubjectExist){
        return next(new AppError('subject does not exist!', 404))
    }
    
    if (checkTopicExist && checkSubjectExist) {
        const result = await knex('topics').where({topic_title: topicParams}).update({topic_title: topic, subject_id: subjectID},"*")

        if (result) {
            res.status(201).json({
                status: "success",
                data: result
            })
        }
    }
    
})

exports.deleteByTopic = catchAsync(async(req, res, next)=>{
    const topicParams = req.params.topic
    const checkTopicExistence = await knex('topics').where({topic_title: topicParams}).first()
    
    if (!checkTopicExistence) {
        return next(new AppError('topic does not exist!', 404))
    }
    const checkTopicHasQuestion = await knex('exam_questions').where({topic_id: checkTopicExistence.id})

    if (checkTopicExistence && checkTopicHasQuestion.length > 0) {
         await knex('exam_questions').where({topic_id: checkTopicExistence.id}).del()
         await knex('topics').where({topic_title: topicParams}).del()
        res.status(204).json({
            status: "success",
            data: "Topic deleted successfully"
        })
    }
})


exports.updateBySubject = catchAsync(async(req, res, next)=>{
    const subjectParams = req.params.subject
    const subject = req.body.subject
    if (!subject) {
        return next(new AppError("Missing required field!!!", 404))  
    }
    const checkSubjectExist = knex('subjects').where({subject_title: subjectParams}).first()

    if (!checkSubjectExist) {
        return next(new AppError("subject does not exist!!!", 404))  
    }

    const result = await knex('subjects').where({subject_title: subjectParams}).update({subject_title: subject}, "*")

    if (result) {
        res.status(201).json({
            status: "success",
            data: result
        })
    }

})


exports.deleteBySubject = catchAsync(async(req, res, next)=>{
    const subjectParams = req.params.subject
    if (!subjectParams) {
        return next(new AppError("Missing required field!!!", 404))         
    }

    const checkSubjectExist = await knex('subjects').where({subject_title: subjectParams}).first()

    if (!checkSubjectExist) {
        return next(new AppError("subject does not exist!!!", 404))  
    }

        await knex('exam_questions').where({subject_id: JSON.stringify(checkSubjectExist.id)}).del()

        await knex('topics').where({subject_id: checkSubjectExist.id}).del()

        await knex('subjects').where({subject_title: subjectParams}).del()


        res.status(204).json({
            status: "success",
            data: "Subject deleted successfully"
        })

})

