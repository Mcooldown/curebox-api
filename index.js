const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Transfer file/data protocol
app.use(cors())

app.use(express.json({limit: '50mb'})); //kirim req data tipe json
app.use(express.urlencoded({ extended: true, limit:'50mb' }));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

const productRoutes = require('./src/routes/product');
const articleRoutes = require('./src/routes/article');
const authRoutes = require('./src/routes/auth');
const cartRoutes = require('./src/routes/cart');
const transactionRoutes = require('./src/routes/transaction');
const forumRoutes = require('./src/routes/forum');
app.use('/v1/products', productRoutes);
app.use('/v1/articles', articleRoutes);
app.use('/v1/auth', authRoutes);
app.use('/v1/cart', cartRoutes);
app.use('/v1/transactions', transactionRoutes);
app.use('/v1/forums', forumRoutes);


// Error Message
app.use((error, req, res, next) => {

     console.log(error);
     const status = error.errorStatus || 500;
     const message = error.errorMessage;
     const data = error.data;

     res.status(status).json({message: message, data: data});
})

// Connect Database
mongoose.connect('mongodb+srv://vincenthadinata:dJaTYMpyjEHF2Kps@curebox.vl0av.mongodb.net/curebox?retryWrites=true&w=majority')
.then(() => {
     app.listen(process.env.PORT || 4000, () => console.log('Connection success'));
})
.catch(err => console.log(err));