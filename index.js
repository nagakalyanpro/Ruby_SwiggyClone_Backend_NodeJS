const express = require('express');
const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const bodyParser = require('body-parser')
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const cors = require('cors');
const path = require('path');


const app = express();

dotEnv.config()
app.use(bodyParser.json())
app.use(cors());



mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((error) => console.log(error))


const PORT = process.env.PORT || 4500;

app.use('/uploads', express.static('uploads'));

app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/products', productRoutes);
app.use('/user', userRoutes);
app.use('/cart', cartRoutes);


app.listen(PORT, () => {
    console.log(`server started & running at ${PORT}`);
})