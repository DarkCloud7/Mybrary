const express = require('express')
const router = express.Router()
const Author = require('../models/author')

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
            searchInput: req.query.name 
        })
    } catch (error) {
        res.redirect('/')
    }
})

// Get new author form
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
        res.redirect('authors')
        // TODO: Change redirection to:
        // res.redirect(`authors/${newAuthor.id}`)
    } catch (error) {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author',
        })
    }
})

module.exports = router