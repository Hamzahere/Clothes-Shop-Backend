const mongoose = require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId

const itemSchema = new mongoose.Schema({
    owner : {
        type: ObjectID,
        required: true,
        ref: 'User'
    },
    id:{
        type:String,
        required:true
    },
    sku:{
        type:String,
        required:true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    image:{
type:String,
required:true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item