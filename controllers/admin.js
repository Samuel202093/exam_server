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



  exports.loginAdmin = catchAsync(async(req, res, next)=>{
    const {email, password} = req.body
    if (!email || !password) {
        return next(new AppError("Please Enter email and password details", 400))
       }
     
       const result = await knex.select().from('admins').where('email',email)
       
       if (!result[0] || !(await bcrypt.compare(password, result[0].password))) {
         return next(new AppError("Incorrect email or password", 401))
       }

       if (result[0].role !== 'admin') {
        return next(new AppError("Permission denied!!!!!!", 403))
       }

       if (result[0].role === 'admin') {
        const token = signToken(result[0].id)

        res.status(200).json({status: "success", token, data: result[0]})
       }

       
  })



  exports.signUpEditor = catchAsync(async(req, res, next)=>{
    let {firstname, lastname, email, password} = req.body
    let hashPassword = await bcrypt.hash(password, 12)
    password = hashPassword
  
    const result = await knex.raw("INSERT INTO admins (first_name, last_name, email, password) VALUES(?, ?, ?, ?) RETURNING *",[firstname, lastname, email, password])
  
    const token = signToken(result.rows[0].id)
  
    res.status(201).json({status: "success", token, data:{user: result.rows}})
  })



  exports.changeEditorPassword = catchAsync(async(req, res, next)=>{
    const adminId = Number(req.params.id)
    const result = await knex.select().from('admins').where('id', adminId)
  
    const hashPassword = await bcrypt.hash(req.body.password, 12)
  
    if (!result[0]) {
      return next(new AppError("Admin does not exist!!!", 401))
    }
   
      const updatedPassword = await knex('admins').where({id: adminId}).update({password:hashPassword},"*")
  
      res.status(201).json({
        status: "success",
        data: updatedPassword
      })
  })



  exports.suspendEditor = catchAsync(async(req, res, next)=>{
    const adminId = Number(req.params.id)
    const result = await knex.select().from('admins').where('id', adminId)
    if (!result) {
      return next(new AppError("Admin does not exist!!!", 401))
    }
    const updatedStatus = await knex('admins').where({id:adminId}).update({status: 'suspended'}, "*")
  
    res.status(201).json({
      status: "success",
      data: updatedStatus
    })
  })




  exports.getEditors = catchAsync(async(req, res, next)=>{
    const adminId = Number(req.params.id)

    const result = await knex.select().from('admins').where({id:adminId})
    if (!result) {
      return next(new AppError("Admin does not exist!!!", 401))
    }
  
    res.status(200).json({
      status: "success",
      data: result
    })
  })




  exports.unSuspendEditor = catchAsync(async(req, res, next)=>{
    const adminId = Number(req.params.id)
    const result = await knex.select().from('admins').where('id', adminId)
    if (!result) {
      return next(new AppError("Admin does not exist!!!", 401))
    }
    const updatedStatus = await knex('admins').where({id:adminId}).update({status: 'active'}, "*")
  
    res.status(201).json({
      status: "success",
      data: updatedStatus
    })
  })




  exports.deleteEditor =  catchAsync(async(req, res, next)=>{
    const adminId = Number(req.params.id)
    const result = await knex.select().from('admins').where({id : adminId })
    if (!result) {
      return next(new AppError("Admin does not exist!!!", 401))
    }
  
    const deletedAdmin = await knex('admins').where({id: adminId}).del()
    
    res.status(204).json({
      status: "success",
      data: deletedAdmin
    })
  })

