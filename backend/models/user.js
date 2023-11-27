const mongoose = require('mongoose');

const User = mongoose.model("User", new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
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
    campus: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        default: 5
    },
    postedItemIds: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }],
        default: []
    }
}));

module.exports = User;