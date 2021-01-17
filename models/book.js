import { Schema, model } from 'mongoose'

const coverImageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

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
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required:true
    },
    authorId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
})

bookSchema.virtual('coverImageSource').get(function () {
    if (this.coverImage && this.coverImageType) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

bookSchema.methods.setCoverByBase64String = function(base64EncodedString){
    if(!base64EncodedString) return
    const cover = JSON.parse(base64EncodedString)
    if(cover && coverImageMimeTypes.includes(cover.type)){
        this.coverImage = new Buffer.from(cover.data, 'base64')
        this.coverImageType = cover.type
    }
}

export default model('Book', bookSchema)