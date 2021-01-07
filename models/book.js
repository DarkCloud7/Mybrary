import { Schema, model } from 'mongoose'

export const coverImageBasePath = 'uploads/bookCovers'

const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    publishDate: {
        type: Date,
        required: true,
    },
    pageCount: {
        type: Number,
        required: true,
        default: 1
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: true
    },
    authorId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
})

export default model('Book', bookSchema)