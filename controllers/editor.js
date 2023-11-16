const { promisify } = require('util')
const db = require("../db/index");
const dotenv = require("dotenv").config();
const bcrypt = require('bcryptjs')
const catchAsync = require('../utils/catchAsync')
const AppError = require("../utils/appError")
const crypto = require("crypto");
const jwt = require('jsonwebtoken')
const knex = require('../db/db')


const signToken = (id)=>{
  return jwt.sign( { id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRY_DATE})
}



exports.loginEditor = catchAsync(async(req, res, next)=>{
  const {email, password} =  req.body
  if (!email || !password) {
   return next(new AppError("Please Enter email and password details", 400))
  }

  const result = await knex.select().from('admins').where('email',email)
  
  if (!result[0] || !(await bcrypt.compare(password, result[0].password))) {
    return next(new AppError("Incorrect email or password", 401))
  }

  const token = signToken(result[0].id)

  res.status(200).json({status: "success", token, data: result[0]})
})



