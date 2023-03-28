const express = require('express');
const cartRouter = require('./cart.router');
const categoryRouter = require('./category.router');
const productRouter = require('./product.router');
const productImgRouter = require('./productImg.router');
const purchaseRouter = require('./purchase.router');
const userRouter = require('./user.router');
const router = express.Router();

// colocar las rutas aquí
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/product_images', productImgRouter);
router.use('/carts', cartRouter);
router.use('/purchases', purchaseRouter);

module.exports = router;