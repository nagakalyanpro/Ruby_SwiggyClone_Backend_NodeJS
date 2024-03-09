const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const multer = require('multer');
const path = require('path');
const dotEnv = require('dotenv')
const jwt = require('jsonwebtoken')

dotEnv.config();
const secretKey = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
    const token = req.headers.token;
    if (!token) return res.status(401).json({ error: 'Access denied. Token not provided' });

    jwt.verify(token, secretKey, (err, decodedToken) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.vendorId = decodedToken.vendorId;
        next();
    });
};

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });


const addFirm = async(req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const vendor = await Vendor.findById(req.vendorId);

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        if (vendor.firm.length > 0) {
            return res.status(400).json({ message: "Vendor can have only one Firm" });
        }

        const firm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id
        });

        const savedFirm = await firm.save();
        const firmId = savedFirm._id;
        const nameFirm = savedFirm.firmName

        vendor.firm.push(savedFirm._id)

        await vendor.save();

        res.status(201).json({ savedFirm, firmId, nameFirm })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

const getFirmRecord = async(req, res) => {
    try {
        const firms = await Firm.find().populate('products');
        res.json({ firms });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "internal server error" });
    }
}

const singleFirm = async(req, res) => {
    try {
        // Retrieve vendor details based on the vendorId from the JWT token
        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Retrieve firm details associated with the vendor
        const firm = await Firm.findOne({ vendor: vendor._id });
        if (!firm) {
            return res.status(404).json({ message: 'Firm record not found for this vendor' });
        }

        const products = await Product.find({ firm: firm._id });

        res.json({ firm: {...firm.toJSON(), products } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getFirmCartDetails = async(req, res) => {
    try {
        const { firmId } = req.params;

        const cart = await Cart.find({ firm: firmId }).populate('user').populate('items.product');

        res.status(200).json({ cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = {
    addFirm: [upload.single('image'), addFirm],
    getFirmRecord,
    authenticateToken,
    singleFirm,
    getFirmCartDetails
};