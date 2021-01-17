import { Router } from 'express'
const router = Router()
import Book from '../models/book.js'
import Author from '../models/author'

// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await queryBooks(req)
        res.render('books/index', {
            books,
            searchOptions: req.query,
        })
    } catch (error) {
        res.redirect('/')
    }
})

// Get new book form
router.get('/new', async (req, res) => {
    await renderNewBookPage(res, new Book())
})

// Post new book
router.post('/', async (req, res) => {
    const book = createBookFromRequest(req)

    try {
        const newBook = await book.save()
        // TODO: Change after making books overview site
        // res.redirect(`books/${newBook.id}`)    
        res.redirect('books')
    } catch (error) {
        renderNewBookPage(res, book, error)
    }
})

export default router

function createBookFromRequest(req) {
    const book = new Book({
        title: req.body.title,
        authorId: req.body.authorId,
        pageCount: req.body.pageCount,
        description: req.body.description,
    })
    book.publishDate = new Date(req.body.publishDate),
    book.setCoverByBase64String(req.body.cover)
    return book
}

function queryBooks(req) {
    const bookQuery = Book.find()
    if (req.query.title) {
        bookQuery.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedAfter) {
        bookQuery.gte('publishDate', req.query.publishedAfter)
    }
    if (req.query.publishedBefore) {
        bookQuery.lte('publishDate', req.query.publishedBefore)
    }
    return bookQuery
}

async function renderNewBookPage(res, book, error) {
    try {
        const authors = await Author.find({})
        const params = { book, authors }
        if (error) params.errorMessage = error.toString()
        res.render('books/new', params)
    } catch (error) {
        res.redirect('/')
    }
}
