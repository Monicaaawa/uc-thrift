const mongoose = require('mongoose');

const Item = mongoose.model("Item", new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    images: {
        type: [String],
        default: []
    },
    timestamp: {
        type: Number
    }
}));


module.exports = Item;