const express = require('express');
const categoryRouter = require('./category.router');
const userRouter = require('./user.router');
const router = express.Router();

// colocar las rutas aquí
router.use('/users', userRouter);
router.use('/categories', categoryRouter);

module.exports = router;