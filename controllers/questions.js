const db = require("../db/index");
const { cloudinary } = require("../utils/cloudinary");
const path = require("path");

exports.createQuestions = async(req, res)=>{
    try {
        const {examYear, examType, subject, topic, options, answer, question} = req.body

        if (!req.file) {
            let typeTableResult = await db.query("INSERT INTO question_type(exam_type) VALUES($1) RETURNING id",[examType])
            const transformTypeResult = typeTableResult.rows.map((x)=>{ return x.id})
            const numTypeResult = Number(Object.values(transformTypeResult))

            let subjectTopicTableResult = await db.query("INSERT INTO question_subjectTopic(type_id, exam_subject, exam_topic) VALUES($1, $2, $3) RETURNING id",[numTypeResult, subject, topic])
            const transformSubjectTopicResult = subjectTopicTableResult.rows.map((x)=>{ return x.id})
            const numSubjectTopicResult = Number(Object.values(transformSubjectTopicResult))

            const  questionResult = await db.query("INSERT INTO questions(type_id, subjectTopic_id, exam_year, exam_questions, options, solution) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",[numTypeResult,numSubjectTopicResult,examYear,question,options,answer])

            res.status(200).send(questionResult.rows)
        }

        if (req.file) {
            const imgResult = await cloudinary.uploader.upload(req.file.path);

            let typeTableResult = await db.query("INSERT INTO question_type(exam_type) VALUES($1) RETURNING id",[examType])
            const transformTypeResult = typeTableResult.rows.map((x)=>{ return x.id})
            const numTypeResult = Number(Object.values(transformTypeResult))

            let subjectTopicTableResult = await db.query("INSERT INTO question_subjectTopic(type_id, exam_subject, exam_topic) VALUES($1, $2, $3) RETURNING id",[numTypeResult, subject, topic])

            const transformSubjectResult = subjectTopicTableResult.rows.map((x)=>{ return x.id})
            const numSubjectTopicResult = Number(Object.values(transformSubjectResult))

            const  questionResult = await db.query("INSERT INTO questions(type_id, subjecttopic_id, exam_year, exam_questions, options, solution, imgUrl) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",[numTypeResult,numSubjectTopicResult,examYear,question,options,answer,imgResult.secure_url])

            res.status(200).send(questionResult.rows)
        }
        
    } catch (error) {
        res.status(500).send({ error: error.message || "server error" });
    }
}

exports.getQuestions = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM questions INNER JOIN question_type ON questions.type_id = question_type.id INNER JOIN question_subjectTopic ON questions.subjectTopic_id = question_subjectTopic.id");
    if (result) {
      res.status(200).send(result.rows);
    } else {
      res.status(400).send("cannot get questions");
    }
  } catch (error) {
    res.status(500).send({ error: error.message || "server error" });
  }
};

exports.getByExamType = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT DISTINCT exam_type AS typeOfExam, COUNT(DISTINCT exam_subject) AS No_of_subject, COUNT(exam_questions) AS No_of_questions FROM questions INNER JOIN question_subjectTopic ON questions.subjectTopic_id = question_subjectTopic.id INNER JOIN question_type ON questions.type_id = question_type.id GROUP BY exam_type"
    );

    if (result) {
      res.status(200).send(result.rows);
    }
  } catch (error) {
    res.status(500).send({ error: error.message || "server error" });
  }
};

exports.getQuestionBySubject = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT COUNT(exam_questions) AS No_of_questions, COUNT(exam_topic) AS No_of_topic, exam_subject AS subjects, STRING_AGG(DISTINCT exam_type, ',') AS Type_of_exam FROM questions INNER JOIN question_subjectTopic ON questions.subjectTopic_id = question_subjectTopic.id INNER JOIN question_type ON questions.type_id = question_type.id GROUP BY exam_subject"
    );
    if (result) {
      res.status(200).send(result.rows);
    }
  } catch (error) {
    res.status(500).send({ error: error.message || "server error" });
  }
};

exports.getQuestionByTopic = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT exam_subject AS subjects, exam_topic AS subject_topic, COUNT(exam_questions) AS No_of_questions FROM questions INNER JOIN question_subjectTopic ON questions.subjectTopic_id = question_subjectTopic.id  GROUP BY exam_subject, exam_topic"
    );
    if (result) {
      res.status(200).send(result.rows);
    } else {
      res.status(400).send("cannot get questions by topic");
    }
  } catch (error) {
    res.status(500).send({ error: error.message || "server error" });
  }
};


exports.deleteExamQuestion = async (req, res) => {
  try {
    const result = await db.query("DELETE FROM questions WHERE id = $1", [
      req.params.id,
    ]);
    res.status(200).send(result.rows);
  } catch (error) {
    res.status(500).send({ error: error.message || "server error" });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { examYear, examType, subject, topic, question, options, answer } =
      req.body;
    const questionId = req.params.id;

    if (!req.file) {
        const questionTable = await db.query("UPDATE questions SET exam_year = $1, exam_questions =$2, options = $3, solution = $4 WHERE id = $5 RETURNING *",[examYear,question,options,answer,questionId])
        
        let {type_id, subjectTopic_id} = questionTable.rows[0]
        const subjectTable = await db.query("UPDATE question_subjectTopic SET exam_subject = $1, exam_topic = $2 WHERE id = $3",[subject, topic, subjectTopic_id]) 
        const typeTable = await db.query("UPDATE question_type SET exam_type = $1 WHERE id = $2",[examType, type_id])

        res.status(200).send(questionTable.rows)
    }

    if (req.file) {

        const imgResult = await cloudinary.uploader.upload(req.file.path);
        let questionTable = await db.query("UPDATE questions SET exam_year = $1, exam_questions = $2, options = $3, imgUrl = $4, solution = $5 WHERE id = $6 RETURNING *",[examYear,question,options,imgResult.secure_url,answer,questionId])

        let {type_id, subjectTopic_id} = questionTable.rows[0]
        const subjectTable = await db.query("UPDATE question_subjectTopic SET exam_subject = $1, exam_topic = $2 WHERE id = $3",[subject, topic, subjectTopic_id]) 
        const typeTable = await db.query("UPDATE question_type SET exam_type = $1 WHERE id = $2",[examType, type_id])

        res.status(200).send(questionTable.rows)
    }
  
  } catch (error) {
    res.status(500).send({ error: error.message || "server error" });
  }
};

exports.updateByTopic = async (req, res) => {
  try {
    const { topic, subject } = req.body;
    const subjectParams = req.params.subject;
    const topicParams = req.params.topic;

    await db.query("BEGIN")
   const result = await db.query("SELECT *, question_type.*, question_subjectTopic.* FROM questions INNER JOIN question_subjectTopic ON questions.subjectTopic_id = question_subjectTopic.id INNER JOIN question_type ON questions.type_id = question_type.id  WHERE question_subjectTopic.exam_subject = $1 AND question_subjectTopic.exam_topic = $2", [subjectParams, topicParams])
   
   const {subjecttopic_id} = result.rows[0]
 
    const subjectTable = await db.query("UPDATE question_subjectTopic SET exam_subject = $1, exam_topic = $2 WHERE id = $3 RETURNING *",[subject, topic, subjecttopic_id])
 
 
     await db.query("COMMIT")
 
    res.status(200).send(subjectTable.rows)

  } catch (error) {
    res.status(500).send({ error: error.message || "server error" });
  } 
};

exports.deleteByTopic = async (req, res) => {
  try {
    const subjectParams = req.params.subject;
    const topicParams = req.params.topic;
    const result = await db.query("DELETE FROM question_subjectTopic WHERE exam_subject = $1 AND exam_topic = $2",[subjectParams, topicParams])

    if (result) {
      res.status(200).send(result.rows);
    } else {
      res.status(400).send("cannot delete question by topic");
    }
  } catch (error) {
    res.status(500).send({ error: error.message || "server error" });
  }
};
