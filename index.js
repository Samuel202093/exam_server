const express = require('express')
const cors = require('cors')
const PORT = 6000 || process.env.PORT
const bodyParser = require('body-parser')
const routes = require('./routes/index')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/error')
const dotenv = require('dotenv').config()

const app = express()


app.use(cors())
app.use(bodyParser.json())

// middleware 
app.use((req, res, next)=>{
    next()
})

app.use('/', routes)
app.all("*", (req, res, next)=>{
    next(new AppError(`cannot find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)


app.listen(process.env.PORT, ()=>{
    console.log(`server running on ${PORT}`)
})