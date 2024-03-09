const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
    }
});

const cartScehma = new mongoose.Schema({
    items: [cartItemSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm',
        required: true
    }

});

const Cart = mongoose.model('Cart', cartScehma);

module.exports = Cart;