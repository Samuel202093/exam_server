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


            let subjectTableResult = await db.query("INSERT INTO question_subject(exam_subject) VALUES($1) RETURNING id",[subject])
            const transformSubjectResult = subjectTableResult.rows.map((x)=>{ return x.id})
            const numSubjectResult = Number(Object.values(transformSubjectResult))


            let topicTableResult = await db.query("INSERT INTO question_topic(topic) VALUES($1) RETURNING id",[topic])
            const transformTopicResult = topicTableResult.rows.map((x)=>{ return x.id})
            const numTopicResult = Number(Object.values(transformTopicResult))

            const  questionResult = await db.query("INSERT INTO questions(type_id, subject_id, topic_id, exam_year, exam_questions, options, solution) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",[numTypeResult,numSubjectResult,numTopicResult,examYear,question,options,answer])

            res.status(200).send(questionResult.rows)
        }

        if (req.file) {
            const imgResult = await cloudinary.uploader.upload(req.file.path);

            let typeTableResult = await db.query("INSERT INTO question_type(exam_type) VALUES($1) RETURNING id",[examType])
            const transformTypeResult = typeTableResult.rows.map((x)=>{ return x.id})
            const numTypeResult = Number(Object.values(transformTypeResult))

            let subjectTableResult = await db.query("INSERT INTO question_subject(exam_subject) VALUES($1) RETURNING id",[subject])

            const transformSubjectResult = subjectTableResult.rows.map((x)=>{ return x.id})
            const numSubjectResult = Number(Object.values(transformSubjectResult))

            let topicTableResult = await db.query("INSERT INTO question_topic(topic) VALUES($1) RETURNING id",[topic])

            const transformTopicResult = topicTableResult.rows.map((x)=>{ return x.id})

            const numTopicResult = Number(Object.values(transformTopicResult))

            const  questionResult = await db.query("INSERT INTO questions(type_id, subject_id, topic_id, exam_year, exam_questions, options, solution, imgUrl) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",[numTypeResult,numSubjectResult,numTopicResult,examYear,question,options,answer,imgResult.secure_url])

            res.status(200).send(questionResult.rows)
        }
        
    } catch (error) {
        res.status(500).send({ error: error.message || "server error" });
    }
}

exports.getQuestions = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM questions INNER JOIN question_type ON questions.type_id = question_type.id INNER JOIN question_subject ON questions.subject_id = question_subject.id INNER JOIN question_topic ON questions.topic_id = question_topic.id");
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
      "SELECT COUNT(DISTINCT exam_subject) AS No_of_subject, COUNT(exam_questions) AS No_of_questions, exam_type AS typeOfExam FROM questions INNER JOIN question_subject ON questions.subject_id = question_subject.id INNER JOIN question_type ON questions.type_id = question_type.id GROUP BY exam_type, exam_subject"
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
      "SELECT COUNT(exam_questions) AS No_of_questions, COUNT(topic_id) AS No_of_topic, subject_id AS subjects, STRING_AGG(DISTINCT exam_type, ',') AS Type_of_exam FROM questions INNER JOIN question_subject ON questions.subject_id = question_subject.id INNER JOIN question_type ON questions.type_id = question_type.id GROUP BY subject_id"
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
      "SELECT exam_subject AS subjects, topic AS subject_topic, COUNT(exam_questions) AS No_of_questions FROM questions INNER JOIN question_topic ON questions.topic_id = question_topic.id INNER JOIN question_subject ON questions.subject_id = question_subject.id  GROUP BY exam_subject, topic"
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
    const result = await db.query("DELETE FROM exam_questions WHERE id = $1", [
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
        const questionTable = await db.query("UPDATE questions SET exam_year = $1, exam_questions =$2, options = $3,solution = $4 WHERE id = $5 RETURNING *",[examYear,question,options,answer,questionId])
        
        let {type_id, subject_id, topic_id} = questionTable.rows[0]
        const topicTable = await db.query("UPDATE question_topic SET topic = $1 WHERE id = $2 RETURNING *",[topic, topic_id])
        const subjectTable = await db.query("UPDATE question_subject SET exam_subject = $1 WHERE id = $2",[subject, subject_id]) 
        const typeTable = await db.query("UPDATE question_type SET exam_type = $1 WHERE id = $2",[examType, type_id])

        res.status(200).send(questionTable.rows)
    }

    if (req.file) {
        const imgResult = await cloudinary.uploader.upload(req.file.path);
        const questionTable = await db.query("UPDATE questions SET exam_year = $1, exam_questions = $2, options = $3, imgUrl = $4, solution = $5 WHERE id = $6 RETURNING *",[examYear,question,options,imgResult.secure_url,answer,questionId])

        let {type_id, subject_id, topic_id} = questionTable.rows[0]
        const topicTable = await db.query("UPDATE question_topic SET topic = $1 WHERE id = $2 RETURNING *",[topic, topic_id])
        const subjectTable = await db.query("UPDATE question_subject SET exam_subject = $1 WHERE id = $2",[subject, subject_id]) 
        const typeTable = await db.query("UPDATE question_type SET exam_type = $1 WHERE id = $2",[examType, type_id])

        res.status(200).send(questionTable.rows)
    }
  
  } catch (error) {
    res.status(500).send({ error: error.message || "server error" });
  }
};

exports.updateByTopic = async (req, res) => {
  try {
    const { subject, topic } = req.body;
    const subjectParams = req.params.subject;
    const topicParams = req.params.topic;

    await db.query("BEGIN")
   const result = await db.query("SELECT *, question_type.*, question_topic.*, question_subject.* FROM questions INNER JOIN question_topic ON questions.topic_id = question_topic.id INNER JOIN question_subject ON questions.subject_id = question_subject.id INNER JOIN question_type ON questions.type_id = question_type.id  WHERE question_subject.exam_subject = $1 AND question_topic.topic = $2", [subjectParams, topicParams])
   
   const {subject_id, topic_id} = result.rows[0]

   const subjectTable = await db.query("UPDATE question_subject SET exam_subject = $1 WHERE id = $2 RETURNING *",[subject, subject_id])

   const topicTable = await db.query("UPDATE question_topic SET topic = $1 WHERE id = $2 RETURNING *",[topic, topic_id])

    await db.query("COMMIT")

console.log(`subject_id is ${subject_id} and typeOf ${typeof subject_id}`)
console.log(`topic_id is ${topic_id} and typeOf ${typeof topic_id}`)

res.status(200).send("updated sucessfully")

  } catch (error) {
    res.status(500).send({ error: error.message || "server error" });
  } 
};

exports.deleteByTopic = async (req, res) => {
  try {
    const subjectParams = req.params.subject;
    const topicParams = req.params.topic;

    const result = await db.query(
      "DELETE FROM exam_questions WHERE (exam_subject, topic) IN (SELECT exam_subject, topic FROM exam_questions WHERE exam_subject = $1 AND topic = $2)",
      [subjectParams, topicParams]
    );

    if (result) {
      res.status(200).send(result.rows);
    } else {
      res.status(400).send("cannot delete question by topic");
    }
  } catch (error) {
    res.status(500).send({ error: error.message || "server error" });
  }
};
