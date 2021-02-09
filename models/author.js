import { Schema, model } from 'mongoose'
import Book from './book'

const authorSchema = new Schema({
    name:{
        type: String,
        required: true,
    }
})

authorSchema.pre('remove', function(next){
    Book.find({ authorId: this.id}, (error, books) =>{
        if (error) {
            next(error)
        } else if (books.length > 0){
            next(new Error('This author still has books in the database.'))
        } else {
            next()
        }
    })
})

export default model('Author', authorSchema)