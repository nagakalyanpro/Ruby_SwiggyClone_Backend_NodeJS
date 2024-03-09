const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const Firm = require('../models/Firm')

const addToCart = async(req, res) => {
    try {
        const { firmId, userId } = req.params
        const { productId, quantity } = req.body;

        if (!userId) {
            console.error("userId missing");
            return res.status(400).json({ message: "UserId is required" });
        }

        const user = await User.findById(userId);
        const firm = await Firm.findById(firmId);
        const product = await Product.findById(productId);

        if (!user || !firm || !product) {
            return res.status(404).json({ message: 'User, Firm, or Product not found' });
        }

        if (product.firm.toString() !== firmId) {
            return res.status(400).json({ message: 'Product does not belong to the specified firm' });
        }

        let userCart = await Cart.findOne({ user: userId, firm: firmId });

        if (!userCart) {
            userCart = new Cart({
                user: userId,
                firm: firmId,
                items: [],
            });
        }

        const existingCartItem = userCart.items.find(item => item.product.toString() === productId);

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
        } else {
            userCart.items.push({
                product: productId,
                quantity: quantity,
            });
        }

        await userCart.save();

        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { addToCart };