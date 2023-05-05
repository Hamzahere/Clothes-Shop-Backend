const mongoose = require('mongoose')
const ObjectID = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema({
    owner : {
        type: ObjectID,
        required: false,
        ref: 'User'
    },
    items: [{
        name: String,
        price: Number
    }],
    total: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order