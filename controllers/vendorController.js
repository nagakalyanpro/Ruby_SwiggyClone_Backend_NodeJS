const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');


dotEnv.config()
const secretKey = process.env.SECRET_KEY;

const vendorRegister = async(req, res) => {
    const { username, email, password } = req.body;
    try {
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json("Email already taken");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        })
        await newVendor.save();

        res.status(201).json({ message: "vendor registered successfully!", username });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const vendorLogin = async(req, res) => {
    const { email, password } = req.body;
    try {
        const vendor = await Vendor.findOne({ email });

        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        await vendor.populate('firm');

        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: "1h" });
        const username = vendor.username;
        const firm = vendor.firm[0].firmName
        res.json({ token, email, username, firm });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getAllVendorDetails = async(req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');
        res.json({ vendors });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = { vendorRegister, vendorLogin, getAllVendorDetails };