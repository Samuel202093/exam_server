const { promisify } = require('util')
const db = require("../db/index");
const dotenv = require("dotenv").config();
const catchAsync = require('../utils/catchAsync')
const knex = require('../db/db')
const AppError = require("../utils/appError")
const jwt = require('jsonwebtoken')


exports.isLoggedIn = catchAsync(async(req, res, next)=>{
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return next(new AppError('Access Denied!! Please log in to get access', 401))
    }
    const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  
      const currentAdmin = await knex.select().from('admins').where('id', JSON.parse(decodedToken.id))

      if(!(JSON.stringify(currentAdmin[0]))){
        return next(new AppError("User matching to this token does not exist!", 401))
      }
  
      req.user = JSON.stringify(currentAdmin[0])
      
    next()
  })


  exports.isSuspended = catchAsync(async(req, res, next)=>{
    let token;
      const stringRequest = req.headers.authorization

      if (stringRequest && stringRequest.startsWith('Bearer')) {
        token = stringRequest.split(' ')[1];
      }
      
      if (!token) {
        return next(new AppError('Access Denied!! Please log in to get access', 401))
      }
      const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

      const checkStatus = await knex.select().from('admins').where('id', JSON.parse(decodedToken.id))

      if (checkStatus[0].status === 'suspended') {
        return next(new AppError('Access Denied!! Your account has been suspended', 401))
      }
      next()
  })


  

  exports.restrictedTo = (...position)=>{
    return async(req, res, next)=>{
      let token;
      const stringRequest = req.headers.authorization

      if (stringRequest && stringRequest.startsWith('Bearer')) {
        token = stringRequest.split(' ')[1];
      }
      
      if (!token) {
        return next(new AppError('Access Denied!! Please log in to get access', 401))
      }
      const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

      const checkRole = await knex.select().from('admins').where('id', JSON.parse(decodedToken.id))

      if (JSON.stringify(position).includes(checkRole[0].role)) {
        next()
      }else{
        return next(new AppError("Permission Denied!!! You are not allowed to perform this action", 403))
      }
    }
  }




