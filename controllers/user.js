const { promisify } = require('util')
const db = require("../db/index");
const dotenv = require("dotenv").config();
const bcrypt = require('bcryptjs')
const catchAsync = require('../utils/catchAsync')
const AppError = require("../utils/appError")
const crypto = require("crypto");
const jwt = require('jsonwebtoken')


const signToken = (id)=>{
  return jwt.sign( { id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRY_DATE})
}



exports.signUp = catchAsync(async(req, res, next)=>{
  let { email, password} = req.body
  let hashPassword = await bcrypt.hash(password, 12)
  password = hashPassword

  const result = await db.query("INSERT INTO users (email, userPassword) VALUES($1, $2) RETURNING *",[email, password])

  const token = signToken(result.rows[0].id)

  res.status(201).json({status: "success", token, data:{user: result.rows}})
})


exports.login = catchAsync(async(req, res, next)=>{
  const {email, password} =  req.body
  if (!email || !password) {
   return next(new AppError("Please Enter email and password details", 400))
  }

  const result = await db.query("SELECT * FROM users WHERE email = $1", [email])

  if (!result.rows || !(await bcrypt.compare(password, result.rows[0].userpassword))) {
    return next(new AppError("Incorrect email or password", 401))
  }

  const token = signToken(result.rows[0].id)

  res.status(200).json({status: "success", token})
})

