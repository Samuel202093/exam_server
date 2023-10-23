const AppError = require("../utils/appError")


module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"

    if (err.message === 'invalid signature') {
        return  res.json({
            status: 401,
            message: 'Invalid token! Please log in again'
        })
    }


    if (err.message === "duplicate key value violates unique constraint \"users_email_key\"") {
       return  res.json({
            status: 401,
            message: 'Email already exist! Please create a new email address'
        })
    }

    if (err.message === "jwt expired") {
        return  res.json({
             status: 401,
             message: 'Token Expired! Please log in again'
         })
     }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
}