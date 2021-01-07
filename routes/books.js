import { Router } from 'express'
const router = Router()
import Book, { coverImageBasePath } from '../models/book'
import Author from '../models/author'

// File upload setup
import multer from 'multer'
import path from 'path'
const uploadPath = path.join('public', coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// Get all books
router.get('/', async (req, res) => {
    res.send('All books')
})

// Get new book form
router.get('/new', async (req, res) => {
    await renderNewBookForm(res, new Book())
})

// Post new book
router.post('/', upload.single('cover'), async (req, res) => {
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
        renderNewBookForm(res, book, error)
    }

})

export default router

async function renderNewBookForm(res, book, error) {
    try {
        const authors = await Author.find({})
        const params = { book, authors }
        if (error) params.errorMessage = error.toString()
        res.render('books/new', params)
    } catch (error) {
        res.redirect('/')
    }
}
