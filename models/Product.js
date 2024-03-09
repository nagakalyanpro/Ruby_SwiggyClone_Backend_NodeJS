const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    firm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm'
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true
    },
    category: {
        type: [{
            type: String,
            enum: ['break-fast', 'lunch', 'snacks', 'dinner']
        }],
        required: true
    },
    // category: {
    //     type: String,
    //     required: true,
    //     enum: ['break-fast', 'lunch', 'snacks', 'dinner']
    // },

    discount: {
        type: String
    },
    image: {
        type: String
    },
    bestSeller: {
        type: Boolean
    },
    description: {
        type: String
    }

})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;