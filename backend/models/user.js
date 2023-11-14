const mongoose = require('mongoose');

const User = mongoose.model("User", new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 5
    },
    postedItems: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }],
        default: []
    }
}));

module.exports = User;