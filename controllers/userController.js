const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');
const bcrypt = require('bcryptjs');
const Cart = require('../models/Cart');


dotEnv.config()
const secretKey = process.env.SECRET_KEY;

const userRegister = async(req, res) => {
    const { username, email, password } = req.body;
    try {
        const userEmail = await User.findOne({ email });
        if (userEmail) {
            return res.status(400).json("Email already taken");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        return res.status(200).json({ message: "user registered successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const userLogin = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid Credential" });
        }
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
        res.json({ token, userId: user._id, username: user.username });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getCartDetails = async(req, res) => {
    const { firmId, userId } = req.params;
    try {
        const cart = await Cart.findOne({ firm: firmId, user: userId }).populate('items.product');
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' })
        }
        return res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = { userRegister, userLogin, getCartDetails };