const express = require("express");
const dotenv = require("dotenv").config();
const { loginEditor } = require("../controllers/editor");
const { isLoggedIn, isSuspended, restrictedTo } = require("../controllers/auth");
const { signUpEditor, loginAdmin, suspendEditor, unSuspendEditor, deleteEditor, changeEditorPassword} = require('../controllers/admin')
// const questionController = require("../controllers/questions");
const {
  createExamType,
  createTopicSubject,
  createQuestion,
  getQuestions,
  QuestionBySubject,
  questionByExamType,
  questionByTopic,
  deleteQuestionById,
  getQuestion,
  updateQuestion,
  updateByTopic,
  deleteByTopic,
  updateBySubject,
  deleteBySubject,
} = require("../controllers/exams");
const { upload } = require("../utils/cloudinary");
const path = require("path");

const route = express.Router();



//   <========================================= Admin controller ====================================================>

route.post("/signup", restrictedTo("admin"), signUpEditor)
route.post("/login/admin", loginAdmin)
route.patch("/password/:id", isLoggedIn, restrictedTo("admin"), changeEditorPassword)
route.patch("/suspend/:id", isLoggedIn, restrictedTo("admin"), suspendEditor)
route.patch("/unsuspend/:id", isLoggedIn, restrictedTo("admin"), unSuspendEditor)
route.delete( "/adminProfile/:id", isLoggedIn, restrictedTo("admin"), deleteEditor)





//   <========================================= Editor controller ====================================================>

route.post("/login", loginEditor);





//   <========================================= Exams controller ====================================================>

route.post("/examType", isLoggedIn, restrictedTo("admin"), createExamType);
route.post(
  "/subject/topic",
  isLoggedIn,
  restrictedTo("admin"),
  createTopicSubject
);
route.post("/question", isLoggedIn, isSuspended, upload.single("image"), createQuestion);
route.get("/questions", getQuestions);
route.get("/question/:id", getQuestion);
route.get("/question_subject", QuestionBySubject);
route.get("/question_type", questionByExamType);
route.get("/question_topic", questionByTopic);
route.put("/question/:id", isLoggedIn, isSuspended, upload.single("image"), updateQuestion);
route.put("/subject/:topic", isLoggedIn, restrictedTo("admin"), updateByTopic);
route.put("/:subject", isLoggedIn, restrictedTo("admin"), updateBySubject);
route.delete("/question/:id", isLoggedIn, restrictedTo("admin"), deleteQuestionById);
route.delete("/:topic", isLoggedIn, restrictedTo("admin"), deleteByTopic);
route.delete(
  "/question_subject/:subject",
  isLoggedIn,
  restrictedTo("admin"),
  deleteBySubject
);


module.exports = route;
