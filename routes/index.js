const express = require("express");
const dotenv = require("dotenv").config();
const userController = require("../controllers/user");
const { isLoggedIn, isSuspended, restrictedTo } = require("../controllers/auth");
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




//   <========================================= user controller ====================================================>

route.post("/signup", restrictedTo("admin"), userController.signUp);
route.post("/login", userController.login);
route.get("/adminProfile/:id", restrictedTo("admin"), userController.getAdmin);
route.patch(
  "/password/:id",
  isLoggedIn,
  restrictedTo("admin"),
  userController.changePassword
);
route.patch(
  "/suspend/:id",
  isLoggedIn,
  restrictedTo("admin"),
  userController.suspendAdmin
);
route.patch(
  "/unsuspend/:id",
  isLoggedIn,
  restrictedTo("admin"),
  userController.unSuspendAdmin
);
route.delete(
  "/adminProfile/:id",
  restrictedTo("admin"),
  userController.deleteAdmin
);




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
