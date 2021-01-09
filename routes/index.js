import express from 'express'
import Book from '../models/book'
const router = express.Router()
router.get('/', async (req, res) => {
    let books
    try {
        books = await Book.find().sort({createdAt: 'desc'}).limit(10)
    } catch (error) {
        books = []
    }
    res.render('index',{books})
})

export default router