// For non-production environment load environment variables from .env
if (process.env.NODE_ENV !== 'production') {
    const env = require('dotenv')
    env.config();
}

//#region setup database
// connection
import mongoose from 'mongoose'
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

// logging
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))
//#endregion

// #region setup express
// configuration
import express from "express"
const app = express()
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

// middleware
import expressLayouts from "express-ejs-layouts"
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(expressLayouts)
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

// controller setup
import indexRouter from './routes/index'
import authorRouter from './routes/authors'
import bookRouter from './routes/books'
app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

// start server
app.listen(process.env.PORT || 300)
//#endregion