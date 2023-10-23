const { promisify } = require('util')
const db = require("../db/index");
const dotenv = require("dotenv").config();
const catchAsync = require('../utils/catchAsync')
const AppError = require("../utils/appError")
const jwt = require('jsonwebtoken')


exports.protect = catchAsync(async(req, res, next)=>{
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return next(new AppError('Access Denied!! Please log in to get access', 401))
    }
    const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  
      const currentUser = await db.query("SELECT * FROM users WHERE id = $1",[JSON.parse(decodedToken.id)])
      if(!(JSON.stringify(currentUser.rows[0]))){
        return next(new AppError("User matching to this token does not exist!", 401))
      }
  
      req.user = currentUser
    next()
  })

  

  exports.restrictedTo = (...position)=>{
    return (req, res, next)=>{
      const stringRequest = JSON.stringify(req.user.rows[0].roles)

      if (!JSON.stringify(position).includes(stringRequest)) {
        return next(new AppError("Permission Denied!!! You are not allowed to perform this action", 403))
      }
      next()
    }
  }



