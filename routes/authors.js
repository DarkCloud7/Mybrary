import { Router } from 'express'
import Author from '../models/author'
import Book from '../models/book'
const router = Router()

// Get all authors
router.get('/', async (req, res) => {
    const searchOptions = {}
    if (req.query.name) {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {
            authors,
            searchedName: req.query.name
        })
    } catch (error) {
        res.redirect('/')
    }
})

// Get new author page
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

// Post new author
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch (error) {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author.'
        })
    }
})

// Get author
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const booksByAuthor = await Book.find({authorId: author.id}).limit(6).exec()
        res.render('authors/show', {
            author,
            booksByAuthor
        })
    } catch (error) {
        res.redirect('/')
    }
})

// Get edit author page
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author })
    } catch {
        res.redirect('/authors')
    }
})

// Put edit author page
router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating Author.'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect(`/authors`)
    } catch (error) {
        if (author == null) {
            res.redirect('/')
        } else {
            console.log(error.message);
            res.redirect(`/authors/${author.id}`)
        }
    }
})

export default router