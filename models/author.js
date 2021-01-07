import { Schema, model } from 'mongoose'

const authorSchema = new Schema({
    name:{
        type: String,
        required: true,
    }
})

export default model('Author', authorSchema)