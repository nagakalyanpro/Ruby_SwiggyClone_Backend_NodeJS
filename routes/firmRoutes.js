const express = require('express');
const firmController = require('../controllers/firmController');
const verifyToken = require('../middleware/verifyToken');


const router = express.Router();

router.post('/add-firm', verifyToken, firmController.addFirm);
router.get('/all-firms', firmController.getFirmRecord);

router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.header('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

router.get('/single-firm', firmController.authenticateToken, firmController.singleFirm);
router.get('/cart-details/:firmId', firmController.getFirmCartDetails);

module.exports = router;