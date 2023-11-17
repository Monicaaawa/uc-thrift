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
    confirmedPassword: {
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