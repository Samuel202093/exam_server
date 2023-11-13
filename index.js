const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const xss = require('xss-clean')
const routes = require('./routes/index')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/error')
const dotenv = require('dotenv').config()
const rateLimit = require('express-rate-limit')
const PORT = 6000 || process.env.PORT

const app = express()

// http header security 
app.use(helmet())

// the function of the limiter is to make a limited number of request for same IP. The code below is for making only 100 request in 1 hour by same IP. 
const limiter = rateLimit({
    max: 200,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP, please try again later in an hour time!!"
})


app.use('/', limiter)

app.use(cors())
app.use(bodyParser.json())

// Data sanitazation against cross-scripting(XSS) attack 
app.use(xss())


// middleware 
app.use((req, res, next)=>{
    next()
})

app.use('/api/v1', routes)
app.all("*", (req, res, next)=>{
    next(new AppError(`cannot find ${req.originalUrl} on this server!`, 404))
})


app.use(globalErrorHandler)

app.get('/test', (req, res)=>{
    res.status(200).send('Testing API')
})

app.listen(process.env.PORT, ()=>{
    console.log(`server running on ${PORT}`)
})