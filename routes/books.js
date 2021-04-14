import { Router } from 'express'
const router = Router()
import Book from '../models/book.js'
import Author from '../models/author'

// Get new book form
// Must come before "Show book" so it can be matched
router.get('/new', async (req, res) => {
    await renderNewBookPage(res, new Book())
})

// Show book
router.get('/:id', async (req, res) => {

    try {
        const book = await Book
            .findById(req.params.id)
            .populate('authorId')
            .exec()
        book.author = book.authorId
        delete book.authorId
        res.render('books/show', { book })
    } catch (error) {

    }
})

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

// Get edit book form
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)
    } catch (error) {
        res.redirect('/')
    }
})

// Post new book
router.post('/', async (req, res) => {
    const book = createBookFromRequest(req)

    try {
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)    
    } catch (error) {
        renderNewBookPage(res, book, error)
    }
})

// Put updated book
router.put('/:id', async (req, res) => {
    let book

    try {
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if (req.body.cover != null && req.body.cover !== ''){
            book.setCoverByBase64String(req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)    
    } catch (error) {
        if (book != null){
            renderEditPage(res, book, true)
        } else{
            redirect('/')
        }
    }
})

// Delete book
router.delete('/:id', async (req, res) => {
    let book

    try {
        book = await Book.findById(req.params.id)

        await book.remove()
        res.redirect('/books/') 
    } catch (error) {
        if (book != null){
            res.render('books/show',{
                book,
                errorMessage: 'Could not delete book'
            })
        } else{
            redirect('/')
        }
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
    book.publishDate = new Date(req.body.publishDate)
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
    renderFormPage(res, book, 'new', error)
}

async function renderEditPage(res, book, error) {
    renderFormPage(res, book, 'edit', error)
}

async function renderFormPage(res, book, form, error) {
    try {
        const authors = await Author.find({})
        const params = { book, authors }
        if (error) params.errorMessage = error.toString()
        res.render(`books/${form}`, params)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}
