const mongoose = require('mongoose');

const Item = mongoose.model("Item", new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    seller: {
        type: String,
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
        type: String
    },
    timestamp: {
        type: Number
    }
}));

module.exports = Item;