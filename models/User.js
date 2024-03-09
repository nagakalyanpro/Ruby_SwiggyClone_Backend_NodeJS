const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firm: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm',
        required: true
    }],
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    }],
    image: {
        type: String,

    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;