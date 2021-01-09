import { Router } from 'express'
const router = Router()
import fileSytem from 'fs'
import Book, { coverImageBasePath } from '../models/book.js'
import Author from '../models/author'

// Configure middleware for book cover image upload
import multer from 'multer'
import path from 'path'
const uploadPath = path.join('public', coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const coverImageHandler = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
}).single('cover')

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
router.post('/', coverImageHandler, async (req, res) => {
    const fileName = (req.file != null) ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        authorId: req.body.authorId,
        pageCount: req.body.pageCount,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        coverImageName: fileName,
    })

    try {
        const newBook = await book.save()
        // TODO: Change after making books overview site
        // res.redirect(`books/${newBook.id}`)    
        res.redirect('books')
    } catch (error) {
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName)
        }
        renderNewBookPage(res, book, error)
    }

})

export default router

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

function removeBookCover(fileName) {
    const imagePath = path.join(uploadPath, fileName)
    fileSytem.unlink(imagePath, error => {
        if (error) {
            console.error(error)
        }
    })
}
