// For non-production environment load environment variables from .env
import env from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
    env.config();
}

// setup express
import express from "express"
const app = express()
import expressLayouts from "express-ejs-layouts"
import bodyParser from 'body-parser'

// controller setup
import indexRouter from './routes/index'
import authorRouter from './routes/authors'
import bookRouter from './routes/books'

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

// setup database
import mongoose from 'mongoose'
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

// database logging
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

// controller setup
app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

// start server
app.listen(process.env.PORT || 3000)
