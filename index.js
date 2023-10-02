const express = require('express')
const cors = require('cors')
const PORT = 6000 || process.env.PORT
const bodyParser = require('body-parser')
const routes = require('./routes/index')
const dotenv = require('dotenv').config()

const app = express()


app.use(cors())
app.use(bodyParser.json())

app.use('/', routes)


app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`)
})